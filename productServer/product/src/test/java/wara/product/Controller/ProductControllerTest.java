package wara.product.Controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.mock.mockito.MockBeans;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MockMvcBuilder;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import wara.product.Service.ProductService;

import static org.junit.jupiter.api.Assertions.*;


//@ExtendWith(MockitoExtension.class)
@WebMvcTest(ProductController.class)
class ProductControllerTest {

    @InjectMocks
    private ProductController productController;


    @Autowired
    private MockMvc mockMvc;

    @MockBean
    ProductService productService;






    @Test
    void productRegistry() {

    }


    @Test
    void productIamgeRegistry() {
    }

    @Test
    void optionRegistry() {
    }

    @Test
    void optionModify() {
    }

    @Test
    void productModify() {
    }

    @Test
    void stockModify() {
    }

    @Test
    void singleRemove() {
    }

    @Test
    void optionRemove() {
    }

    @Test
    void multiRemove() {
    }

    @Test
    void singleRead() {
    }

    @Test
    void readTargetOption() {
    }

    @Test
    void multiRead() {
    }

    @Test
    void categoryFilter() {
    }

    @Test
    void storeCategoryFilter() {
    }

    @Test
    void targetOptionSpecify() {
    }
}