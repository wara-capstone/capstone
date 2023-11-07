from django.db import models

class Store(models.Model):
    store_id=models.IntegerField(primary_key=True)

    class Meta:
        db_table = 'Store'
    def __str__(self):
        return str(self.store_id)
    
class Cart(models.Model):
    store=models.ForeignKey(Store, on_delete=models.CASCADE)
    user_email = models.EmailField(unique=True)
    date_added = models.DateField(auto_now_add=True)

    class Meta:
        db_table = 'Cart'
        ordering = ['date_added']

    def __str__(self):
        return str(self.user_email)  

class Size(models.Model):
    size = models.CharField(max_length=20)

    class Meta:
        db_table = 'Size'

    def __str__(self):
        return self.size

class Color(models.Model):
    color = models.CharField(max_length=20)

    class Meta:
        db_table = 'Color'

    def __str__(self):
        return self.color

class Product(models.Model):  
    product_id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=255)
    price = models.IntegerField()
    size = models.ManyToManyField(Size)  
    color = models.ManyToManyField(Color)
    class Meta:
        db_table = 'Product'

    def __str__(self):
        return self.name

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)   
    quantity = models.IntegerField(default=0)

    class Meta:
        db_table = 'CartItem'

    def sub_total(self):
            return self.product.price * self.quantity

    def __str__(self):
        return f"{self.product.name} ({self.quantity})"
