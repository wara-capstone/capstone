from django.db import models
    
class Cart(models.Model):
    user_email = models.EmailField(unique=True)

    class Meta:
        db_table = 'Cart'

    def __str__(self):
        return str(self.user_email)  

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE)
    product_id = models.IntegerField()
    store_id=models.IntegerField()
    size = models.CharField(max_length=20)
    color = models.CharField(max_length=20)
    quantity = models.IntegerField()
    price = models.IntegerField()


    class Meta:
        db_table = 'CartItem'

