package com.example.app.repositories;

import com.example.app.models.Gasto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface GastoRepository extends JpaRepository<Gasto, Long> {

    List<Gasto> findByUsuarioId(Long usuarioId);

    List<Gasto> findByUsuarioIdAndFechaBetween(Long usuarioId, LocalDate desde, LocalDate hasta);

    List<Gasto> findByUsuarioIdAndCategoriaId(Long usuarioId, Long categoriaId);

    /**
     * Suma total de gastos de un usuario en un rango de fechas.
     */
    @Query("SELECT COALESCE(SUM(g.monto), 0) FROM Gasto g " +
           "WHERE g.usuario.id = :usuarioId " +
           "AND g.fecha BETWEEN :desde AND :hasta")
    BigDecimal sumMontoByUsuarioIdAndFechaBetween(
            @Param("usuarioId") Long usuarioId,
            @Param("desde") LocalDate desde,
            @Param("hasta") LocalDate hasta);
}
