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

    // Ordenado por fecha descendente — usado en GET /api/ingresos
    List<Ingreso> findByUsuarioIdOrderByFechaDesc(Long usuarioId);

    List<Ingreso> findByUsuarioIdAndFechaBetween(Long usuarioId, LocalDate desde, LocalDate hasta);

    List<Ingreso> findByUsuarioIdAndCategoriaId(Long usuarioId, Long categoriaId);

    long countByCategoriaId(Long categoriaId);

    long countByUsuarioId(Long usuarioId);

    /**
     * Suma total de ingresos del usuario.
     * COALESCE garantiza que retorne 0 si no hay registros (nunca null).
     */
    @Query("SELECT COALESCE(SUM(i.monto), 0) FROM Ingreso i WHERE i.usuario.id = :usuarioId")
    BigDecimal sumTotalByUsuarioId(@Param("usuarioId") Long usuarioId);

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
