from django.db import models
    
class Cart(models.Model):
    user_email = models.EmailField(unique=True)

    class Meta:
        db_table = 'Cart'

    def __str__(self):
        return str(self.user_email)  
    
class Product(models.Model):
    p_id = models.IntegerField()
    p_name=models.CharField(max_length=50)
    size = models.CharField(max_length=20)
    color = models.CharField(max_length=20)
    quantity = models.IntegerField()
    price = models.IntegerField()

    class Meta:
        db_table = 'Product'

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE)
    product =  models.ForeignKey(Product, on_delete=models.CASCADE)
    store_id=models.IntegerField()


    class Meta:
        db_table = 'CartItem'

