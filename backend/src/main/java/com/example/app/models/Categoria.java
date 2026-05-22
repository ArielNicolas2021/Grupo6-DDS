package com.example.app.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/**
 * Entidad que representa una categoría de clasificación financiera.
 * Puede ser de tipo GASTO o INGRESO.
 *
 * Relaciones:
 *   - Una Categoría → muchos Gastos   (OneToMany)
 *   - Una Categoría → muchos Ingresos (OneToMany)
 */
@Entity
@Table(name = "categorias", uniqueConstraints = {
        @UniqueConstraint(name = "uk_categoria_nombre_tipo", columnNames = {"nombre", "tipo"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Categoria {

    /**
     * Tipo de categoría: define si aplica a gastos, ingresos o ambos.
     */
    public enum TipoCategoria {
        GASTO,
        INGRESO,
        AMBOS
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 80)
    private String nombre;

    @Column(length = 200)
    private String descripcion;

    /**
     * Tipo de la categoría. Persiste el nombre del enum como String (más legible en BD).
     * Ejemplo: "GASTO", "INGRESO", "AMBOS"
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TipoCategoria tipo;

    @Column(nullable = false)
    @Builder.Default
    private Boolean activa = true;

    // ── Relaciones ──────────────────────────────────────────────────────────

    /**
     * Gastos clasificados bajo esta categoría.
     * cascade = MERGE, PERSIST: permite propagar operaciones pero no eliminación.
     * Si se elimina una Categoría, los gastos asociados NO se eliminan
     * (se debe manejar en el servicio con lógica de negocio).
     */
    @OneToMany(mappedBy = "categoria", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @Builder.Default
    private List<Gasto> gastos = new ArrayList<>();

    /**
     * Ingresos clasificados bajo esta categoría.
     */
    @OneToMany(mappedBy = "categoria", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @Builder.Default
    private List<Ingreso> ingresos = new ArrayList<>();
}
