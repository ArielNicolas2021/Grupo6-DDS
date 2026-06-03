package com.example.app.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;

/**
 * Entidad que representa una categoria financiera.
 *
 * Regla de negocio:
 *   - usuario == null  → categoria GLOBAL (DataInitializer, visible para todos)
 *   - usuario != null  → categoria PERSONAL (solo visible para ese usuario)
 *
 * La constraint de unicidad cubre (nombre + usuario_id) para permitir que
 * dos usuarios distintos usen el mismo nombre, pero no el mismo usuario dos veces.
 */
@Entity
@Table(name = "categorias", uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_categoria_nombre_usuario",
            columnNames = {"nombre", "usuario_id"}
        )
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"gastos", "ingresos", "usuario"})
public class Categoria {

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

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TipoCategoria tipo;

    @Column(nullable = false)
    @Builder.Default
    private Boolean activa = true;

    /**
     * Propietario de la categoria.
     * null  → categoria global del sistema (visible para todos).
     * !null → categoria personal (visible solo para ese usuario).
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = true,
                foreignKey = @ForeignKey(name = "fk_categoria_usuario"))
    private Usuario usuario;

    @OneToMany(mappedBy = "categoria", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @Builder.Default
    private List<Gasto> gastos = new ArrayList<>();

    @OneToMany(mappedBy = "categoria", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @Builder.Default
    private List<Ingreso> ingresos = new ArrayList<>();
}
