package com.example.app.repositories;

import com.example.app.models.Categoria;
import com.example.app.models.Categoria.TipoCategoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {

       // Categorias globales (del sistema)
       List<Categoria> findByUsuarioIsNullAndActivaTrue();

       // Categorias personales de un usuario
       List<Categoria> findByUsuarioIdAndActivaTrue(Long usuarioId);

       /**
        * Devuelve las categorias visibles para un usuario:
        * sus propias + las globales del sistema.
        */
       @Query("SELECT c FROM Categoria c WHERE c.activa = true AND " +
                     "(c.usuario IS NULL OR c.usuario.id = :usuarioId)")
       List<Categoria> findCategoriasDisponibles(@Param("usuarioId") Long usuarioId);

       /**
        * Verifica si el usuario ya tiene una categoria con ese nombre.
        * Incluye categorias globales para evitar que el usuario duplique una global.
        */
       @Query("SELECT COUNT(c) > 0 FROM Categoria c WHERE " +
                     "LOWER(c.nombre) = LOWER(:nombre) AND " +
                     "(c.usuario IS NULL OR c.usuario.id = :usuarioId)")
       boolean existsByNombreForUsuario(@Param("nombre") String nombre,
                     @Param("usuarioId") Long usuarioId);

       // Para el DataInitializer — categorias globales por tipo
       List<Categoria> findByTipo(TipoCategoria tipo);

       List<Categoria> findByActivaTrue();

       Optional<Categoria> findByIdAndUsuarioId(Long id, Long usuarioId);

       Optional<Categoria> findByIdAndUsuarioIsNull(Long id);
}
