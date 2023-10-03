from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from datetime import timedelta
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import update_last_login
from django.utils import timezone
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.core.mail import send_mail
from .serializers import UserSerializer
import re

@api_view(['POST'])
def register(request):

    print('register:' + str(request.data))

    if request.method == 'POST':

        serializer = UserSerializer(data=request.data)

        print(serializer.is_valid())

        # Validate the data
        if serializer.is_valid():

            username = serializer.validated_data.get('username')
            email = serializer.validated_data.get('email')
            password = serializer.validated_data.get('password')

            # verify data
            if not username or not email or not password:
                return Response({'error': 'All fields are required'}, status=status.HTTP_400_BAD_REQUEST)
            
            if not checkData(username, email, password):
                return Response({'error': 'Invalid data'}, status=status.HTTP_400_BAD_REQUEST)

            # check if user exists
            User = get_user_model()
            if User.objects.filter(username=username).exists():
                return Response({'error': 'Username is already taken'}, status=status.HTTP_400_BAD_REQUEST)
            
            if User.objects.filter(email=email).exists():
                return Response({'error': 'Email is already taken'}, status=status.HTTP_400_BAD_REQUEST)

            # create user
            user = serializer.save()

            refresh = TokenObtainPairSerializer.get_token(user)
            reg_token = str(refresh.access_token)
            reg_token = AccessToken.for_user(user)
            reg_token.set_exp(lifetime=timedelta(minutes=2))
            reg_token_str = str(reg_token)
            #print(reg_token_str)

            send_activation_email(request)

            return Response({

                'registration_complete': True,
                'reg_token': reg_token_str
                
            }, status=status.HTTP_201_CREATED)
        
        else:

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
 
def send_activation_email(request):

    print('send_activation_email:' + str(request.data))

    user = get_user_model().objects.get(username=request.data.get('username'),)

    print(user)

    token = default_token_generator.make_token(user)

    uidb64 = urlsafe_base64_encode(force_bytes(user.pk))

    activation_link = f'http://localhost:3000/activate/{uidb64}/{token}'

    subject = 'Activate your account'
    message = f'''Account Created Successfully!

                First Name: {user.first_name}
                Last Name: {user.last_name}
                Username: {user.username}
                Email: {user.email}

                Click the link below to activate your account:

                {activation_link}'''
    
    from_email = 'rotatingcloudbasicauth@gmail.com' 
    recipient_list = [user.email]

    send_mail(subject, message, from_email, recipient_list)

def checkData(username, email, password):
    return is_valid_username(username) and is_valid_email(email) and is_valid_password(password)

def is_valid_username(username):
    return 3 <= len(username) <= 25

def is_valid_email(email):
    pattern = r'^[\w\.-]+@[a-zA-Z0-9\.-]+\.[a-zA-Z]{2,}$'
    return bool(re.fullmatch(pattern, email))

def is_valid_password(password):
    return 6 <= len(password) <= 25

@api_view(['POST'])
def login(request):

    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)

    if user is not None:

        update_last_login(None, user)
        user.last_login = timezone.now()
        user.save(update_fields=['last_login'])

        try:

            user_data = {

                'first_name': user.first_name,
                'last_name': user.last_name,
                'username': user.username,
                'email': user.email,
                'is_activated': user.is_activated,  # Ensure this field exists on your user model
            }

        except AttributeError as e:

            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # The user is authenticated
        refresh = TokenObtainPairSerializer.get_token(user)
        access = str(refresh.access_token)

        serializer = UserSerializer(user)
        
        return Response({

            'refresh': str(refresh),
            'access': access,
            'user': serializer.data

        }, status=status.HTTP_200_OK)
    
    else:
        # Authentication failed
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    # You can do some server-side cleanup here if needed.
    return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_auth(request):
    auth_token = request.META.get('HTTP_AUTHORIZATION', 'No token found')

    if request.user.is_authenticated:
        
        return Response({"message": "You are authenticated!", 
                         "username": request.user.username, 
                         "email":request.user.email,
                         'is_activated': request.user.is_activated,
                         "user_id": request.user.id}, status=status.HTTP_200_OK)
    else:
        return Response({"error": "You are not authenticated!"}, status=status.HTTP_401_UNAUTHORIZED)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def account_status(request):

    try:
        User = get_user_model()
        user = User.objects.get(id=request.user.id)

        return Response({
            'username': user.username,
            'email': user.email,
            'is_activated': user.is_activated,
        }, status=status.HTTP_200_OK)
        
    except User.DoesNotExist:

        print(f"User with id {request.user.id} does not exist")
        return Response({
            'error': 'User does not exist'
        }, status=status.HTTP_404_NOT_FOUND)
    
    except Exception as e:

        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def edit_profile(request):
    try:
        user = request.user
        serializer = UserSerializer(user, data=request.data, partial=True)
        
        if serializer.is_valid():

            if(serializer.validated_data.get('email') != user.email):

                user.is_activated = False

            serializer.save()

            return Response(serializer.data, status=status.HTTP_200_OK)
        
        else:

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    except user.__class__.DoesNotExist:  # This will handle if the user model instance does not exist
        return Response({'error': 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)
    
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    
        try:
            User = get_user_model()
            user = User.objects.get(id=request.user.id)
    
            # Fetch the request data. Assuming JSON payload in request.
            request_data = request.data
    
            # Update fields
            if 'password' in request_data:
                user.password = make_password(request_data['password'])
            
            # ... add other fields as necessary
    
            # Save the user object with updated fields
            user.save()
    
            return Response({
                'username': user.username,
                'email': user.email,
                'verified': user.is_activated,
            }, status=status.HTTP_200_OK)
            
        except User.DoesNotExist:
            return Response({
                'error': 'User does not exist'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_account_data(request):

    try:

        user = request.user
        # Use the serializer
        serializer = UserSerializer(user)

        print(serializer.data)

        return Response(serializer.data, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def resend_activation_email(request):

    print('resend_activation_email:' + str(request.data))
    send_activation_email(request)
    return Response({'message': 'Activation email sent'}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def delete_account(request):
        
    User = get_user_model()
    user = User.objects.get(id=request.user.id)

    user.delete()

    return Response({'message': "user deleted"}, status=status.HTTP_200_OK)

@api_view(['POST'])
def change_password_request(request):

    print('change password request was made:' + str(request.data))

    response = Response({'message': "request has been made"}, status=status.HTTP_200_OK)

    try:

        User = get_user_model()
        user = User.objects.get(email=request.data['email'])

        print("user:",user)

        print("sending email to user @:", user.email)

        send_password_change_email(request)

        return response
    
    except User.DoesNotExist:

        print(f"User with id {request.user.id} does not exist")
        return response
    
    except Exception as e:

        print(f"Error: {str(e)}")
        return response

def send_password_change_email(request):
    
        print('send_password_reset_email:' + str(request.data))
    
        user = get_user_model().objects.get(email=request.data['email'])
    
        print("user", user)
    
        token = default_token_generator.make_token(user)
    
        uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
    
        activation_link = f'http://localhost:3000/change-password/{uidb64}/{token}'
    
        subject = 'Reset your password'
        message = f'''Reset Password
    
                    Click the link below to reset your password:
    
                    {activation_link}'''
        
        from_email = 'rotatingcloudbasicauth@gmail.com' 
        recipient_list = [user.email]

        send_mail(subject, message, from_email, recipient_list)