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
 * Entidad que representa un ingreso registrado por un usuario.
 *
 * Relaciones:
 *   - Muchos Ingresos → un Usuario    (ManyToOne) — lado propietario
 *   - Muchos Ingresos → una Categoría (ManyToOne) — lado propietario
 */
@Entity
@Table(name = "ingresos", indexes = {
        @Index(name = "idx_ingreso_usuario",   columnList = "usuario_id"),
        @Index(name = "idx_ingreso_categoria", columnList = "categoria_id"),
        @Index(name = "idx_ingreso_fecha",     columnList = "fecha")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"usuario", "categoria"})
public class Ingreso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Monto del ingreso. BigDecimal garantiza precisión exacta en dinero.
     */
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal monto;

    /**
     * Fecha en que se recibió el ingreso.
     */
    @Column(nullable = false)
    private LocalDate fecha;

    @Column(length = 300)
    private String descripcion;

    /**
     * Fuente del ingreso (ej: "Salario", "Freelance", "Dividendos").
     */
    @Column(length = 150)
    private String fuente;

    @Column(name = "fecha_registro", nullable = false, updatable = false)
    private LocalDateTime fechaRegistro;

    // ── Relaciones (lado propietario) ───────────────────────────────────────

    /**
     * Usuario dueño de este ingreso.
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_id", nullable = false,
                foreignKey = @ForeignKey(name = "fk_ingreso_usuario"))
    private Usuario usuario;

    /**
     * Categoría a la que pertenece este ingreso.
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "categoria_id", nullable = false,
                foreignKey = @ForeignKey(name = "fk_ingreso_categoria"))
    private Categoria categoria;

    // ── Lifecycle Callbacks ─────────────────────────────────────────────────

    @PrePersist
    protected void onCreate() {
        this.fechaRegistro = LocalDateTime.now();
    }
}
