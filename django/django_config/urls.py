
from django.contrib import admin
from django.urls import path
from rest_framework_simplejwt import views as jwt_views
from userauth import views
from django.utils.http import urlsafe_base64_decode
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from django.utils.encoding import force_str
from django.contrib.auth.tokens import default_token_generator

class Activate(APIView):

    def post(self, request, uidb64, token):  # Note the 'self' parameter

        print(f"Received uidb64: {uidb64}")

        try:

            uid = force_str(urlsafe_base64_decode(uidb64))
            print(f"Decoded UID: {uid}")

            user = get_user_model().objects.get(id=uid)
            print(f"User: {user}")

        except Exception as e:

            print(f"Error: {str(e)}")

            user = None

        if user is not None and default_token_generator.check_token(user, token):

            user.is_activated = True
            user.save()
            return Response({"message": "Successfully Activated"}, status=status.HTTP_200_OK)
        
        else:

            return Response({"message": "Error! Something went wrong!"}, status=status.HTTP_400_BAD_REQUEST)
        
        
class ChangePassword(APIView):

    def post(self, request, uidb64, token):

        uid = force_str(urlsafe_base64_decode(uidb64))

        print(f"Decoded UID: {uid}")

        user = get_user_model().objects.get(id=uid)

        print(f"User: {user}")

        if user is not None and default_token_generator.check_token(user, token):

            print("User is not None and token is valid")

            new_password = request.data.get("new_password")
            
            if not new_password:

                print("New password not provided!")
                return Response({"message": "New password not provided!"}, status=status.HTTP_400_BAD_REQUEST)
            
            if 6 <= len(new_password) <= 25:

                # Set user's new password and save
                user.set_password(new_password)
                user.save()

                print("Password successfully changed!")
                
                return Response({"message": "Password successfully changed!"}, status=status.HTTP_200_OK)
            
            else:

                return Response({"message": "Invalid Password"}, status=status.HTTP_400_BAD_REQUEST)

        else:

            print("Error! Something went wrong!")
            return Response({"message": "Error! Something went wrong!"}, status=status.HTTP_400_BAD_REQUEST)


urlpatterns = [
    path('admin/', admin.site.urls),
    path('token/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('logout/', views.logout, name='logout'),
    path('check-auth/', views.check_auth, name='check-auth'),
    path('account-status/', views.account_status, name='account-status'),
    path('edit_profile/', views.edit_profile, name='edit_profile'),
    path('change-password/', views.change_password, name='change-password'),
    path('delete-account/', views.delete_account, name='delete-account'),
    path('activate/<uidb64>/<token>/', Activate.as_view(), name='activate'),
    path('get-account-data/', views.get_account_data, name='get-account-data'),
    path('resend-activation-email/', views.resend_activation_email, name='resend-activation-email'),
    path('delete-account/', views.delete_account, name='delete-account'),
    path('change-password-request/', views.change_password_request, name='change-password-request'),
    path('send-password-change-email/', views.send_password_change_email, name='send_password_change_email'),
    path('change-password/<uidb64>/<token>/', ChangePassword.as_view(), name='change-password'),
]
