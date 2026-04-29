package com.example.app.repositories;

import com.example.app.models.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositorio para la entidad Product.
 * Representa la capa REPOSITORY de la arquitectura en capas.
 * Extiende JpaRepository para obtener CRUD básico sin código adicional.
 */
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // Spring Data JPA genera la query automáticamente
    List<Product> findByNameContainingIgnoreCase(String name);
}
