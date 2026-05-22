package com.example.app.repositories;

import com.example.app.models.Categoria;
import com.example.app.models.Categoria.TipoCategoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
    List<Categoria> findByTipo(TipoCategoria tipo);
    List<Categoria> findByActivaTrue();
}
