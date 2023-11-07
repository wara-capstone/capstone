from django.urls import re_path, include, path
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions
from . import views

# Schema view can be restricted to only showing if user is authenticated
schema_view = get_schema_view(
    openapi.Info(
        title="Your API",
        default_version='v1',
        description="API documentation for Your App",
        terms_of_service="https://www.yourcompany.com/terms/",
        contact=openapi.Contact(email="contact@yourcompany.local"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('add', views.add_to_cart, name='add-to-cart'),
    path('view/<str:user_email>', views.view_cart, name='view-cart'),
    path('remove', views.remove_from_cart, name='remove-from-cart'),
    path('update', views.update_cart_item, name='update-cart-item'),

    # Swagger urls
    re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]

# If you're also using Django's authentication system, you may want to include login and logout views for browsable API.
urlpatterns += [
    path('api-auth/', include('rest_framework.urls')),
]
