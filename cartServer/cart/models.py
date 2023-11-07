from django.db import models

class Cart(models.Model):
    user_email = models.EmailField(unique=True)
    date_added = models.DateField(auto_now_add=True)

    class Meta:
        db_table = 'Cart'
        ordering = ['date_added']

    def __str__(self):
        return str(self.id)  

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
    name = models.CharField(max_length=255)
    price = models.IntegerField()
    size = models.ManyToManyField(Size)  
    color = models.ManyToManyField(Color)  
    class Meta:
        db_table = 'Product'

    def __str__(self):
        return self.name

class CartItem(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)  
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE)
    quantity = models.IntegerField()

    class Meta:
        db_table = 'CartItem'

    def sub_total(self):
        return self.product.price * self.quantity

    def __str__(self):
        return f"{self.product.name} ({self.quantity})"
