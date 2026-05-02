package com.example.app.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Entidad que representa un gasto registrado por un usuario.
 *
 * Relaciones:
 *   - Muchos Gastos → un Usuario   (ManyToOne)  — lado propietario
 *   - Muchos Gastos → una Categoría (ManyToOne) — lado propietario
 */
@Entity
@Table(name = "gastos", indexes = {
        @Index(name = "idx_gasto_usuario",   columnList = "usuario_id"),
        @Index(name = "idx_gasto_categoria", columnList = "categoria_id"),
        @Index(name = "idx_gasto_fecha",     columnList = "fecha")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
// Evita StackOverflow al imprimir: excluye la referencia al usuario (lado inverso)
@ToString(exclude = {"usuario", "categoria"})
public class Gasto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Monto del gasto. Se usa BigDecimal para precisión monetaria.
     * precision = 15 dígitos totales, scale = 2 decimales.
     */
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal monto;

    /**
     * Fecha en que se realizó el gasto (solo fecha, sin hora).
     */
    @Column(nullable = false)
    private LocalDate fecha;

    @Column(length = 300)
    private String descripcion;

    /**
     * Número de referencia o comprobante (opcional).
     */
    @Column(name = "numero_referencia", length = 100)
    private String numeroReferencia;

    @Column(name = "fecha_registro", nullable = false, updatable = false)
    private LocalDateTime fechaRegistro;

    // ── Relaciones (lado propietario: contiene la FK en la tabla) ───────────

    /**
     * Usuario dueño de este gasto.
     * @JoinColumn define el nombre de la FK en la tabla "gastos".
     * fetch = LAZY: el usuario no se carga hasta que se accede explícitamente.
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_id", nullable = false,
                foreignKey = @ForeignKey(name = "fk_gasto_usuario"))
    private Usuario usuario;

    /**
     * Categoría a la que pertenece este gasto.
     * optional = false: un gasto SIEMPRE debe tener categoría.
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "categoria_id", nullable = false,
                foreignKey = @ForeignKey(name = "fk_gasto_categoria"))
    private Categoria categoria;

    // ── Lifecycle Callbacks ─────────────────────────────────────────────────

    @PrePersist
    protected void onCreate() {
        this.fechaRegistro = LocalDateTime.now();
    }
}
