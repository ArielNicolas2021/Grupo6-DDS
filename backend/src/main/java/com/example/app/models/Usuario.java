package com.example.app.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Entidad que representa a un usuario del sistema de gestión financiera.
 * Es la entidad raíz: posee todos los Gastos e Ingresos.
 *
 * Relaciones:
 *   - Un Usuario → muchos Gastos   (OneToMany)
 *   - Un Usuario → muchos Ingresos (OneToMany)
 */
@Entity
@Table(name = "usuarios", uniqueConstraints = {
        @UniqueConstraint(name = "uk_usuario_email", columnNames = "email")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(nullable = false, length = 150)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(name = "fecha_registro", nullable = false, updatable = false)
    private LocalDateTime fechaRegistro;

    @Column(nullable = false)
    @Builder.Default
    private Boolean activo = true;

    // ── Relaciones ──────────────────────────────────────────────────────────

    /**
     * Un usuario puede tener muchos gastos.
     * mappedBy = "usuario" indica que Gasto es el lado propietario de la relación.
     * cascade = ALL: si se elimina el usuario, se eliminan sus gastos.
     * orphanRemoval = true: gastos huérfanos son eliminados automáticamente.
     */
    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Gasto> gastos = new ArrayList<>();

    /**
     * Un usuario puede tener muchos ingresos.
     */
    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Ingreso> ingresos = new ArrayList<>();

    // ── Lifecycle Callbacks ─────────────────────────────────────────────────

    @PrePersist
    protected void onCreate() {
        this.fechaRegistro = LocalDateTime.now();
    }

    // ── Métodos de conveniencia ─────────────────────────────────────────────

    public void agregarGasto(Gasto gasto) {
        gastos.add(gasto);
        gasto.setUsuario(this);
    }

    public void agregarIngreso(Ingreso ingreso) {
        ingresos.add(ingreso);
        ingreso.setUsuario(this);
    }
}
