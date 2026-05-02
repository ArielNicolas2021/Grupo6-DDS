package com.example.app.repositories;

import com.example.app.models.Ingreso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface IngresoRepository extends JpaRepository<Ingreso, Long> {

    List<Ingreso> findByUsuarioId(Long usuarioId);

    List<Ingreso> findByUsuarioIdAndFechaBetween(Long usuarioId, LocalDate desde, LocalDate hasta);

    List<Ingreso> findByUsuarioIdAndCategoriaId(Long usuarioId, Long categoriaId);

    /**
     * Suma total de ingresos de un usuario en un rango de fechas.
     */
    @Query("SELECT COALESCE(SUM(i.monto), 0) FROM Ingreso i " +
           "WHERE i.usuario.id = :usuarioId " +
           "AND i.fecha BETWEEN :desde AND :hasta")
    BigDecimal sumMontoByUsuarioIdAndFechaBetween(
            @Param("usuarioId") Long usuarioId,
            @Param("desde") LocalDate desde,
            @Param("hasta") LocalDate hasta);
}
