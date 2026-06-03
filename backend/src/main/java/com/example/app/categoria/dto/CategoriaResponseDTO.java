package com.example.app.categoria.dto;

import com.example.app.models.Categoria.TipoCategoria;
import lombok.Builder;
import lombok.Data;

/**
 * DTO de salida para operaciones sobre Categoria.
 *
 * El campo "esGlobal" indica si la categoría es del sistema (true)
 * o fue creada por el usuario (false). Útil para el frontend para
 * saber si puede editar/eliminar la categoría o no.
 */
@Data
@Builder
public class CategoriaResponseDTO {

    private Long id;
    private String nombre;
    private String descripcion;
    private TipoCategoria tipo;
    private Boolean activa;
    private Boolean esGlobal;   // true = del sistema, false = personal del usuario
}
