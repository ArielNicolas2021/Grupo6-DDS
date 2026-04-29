package com.example.app.services;

import com.example.app.models.Product;
import com.example.app.repositories.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Servicio de negocio para la entidad Product.
 * Representa la capa SERVICE de la arquitectura en capas.
 * Contiene la lógica de negocio y coordina entre Controller y Repository.
 */
@Service
public class ProductService {

    private final ProductRepository productRepository;

    // Inyección de dependencias por constructor (mejor práctica)
    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> findAll() {
        return productRepository.findAll();
    }

    public Optional<Product> findById(Long id) {
        return productRepository.findById(id);
    }

    public Product save(Product product) {
        return productRepository.save(product);
    }

    public void deleteById(Long id) {
        productRepository.deleteById(id);
    }

    public List<Product> searchByName(String name) {
        return productRepository.findByNameContainingIgnoreCase(name);
    }
}
