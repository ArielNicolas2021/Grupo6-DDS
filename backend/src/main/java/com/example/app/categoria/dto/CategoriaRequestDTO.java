package com.example.app.categoria.dto;

import com.example.app.models.Categoria.TipoCategoria;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * DTO de entrada para POST /api/categorias
 */
@Data
public class CategoriaRequestDTO {

    @NotBlank(message = "El nombre es obligatorio")
    @Size(min = 2, max = 80, message = "El nombre debe tener entre 2 y 80 caracteres")
    private String nombre;

    @Size(max = 200, message = "La descripción no puede superar 200 caracteres")
    private String descripcion;

    @NotNull(message = "El tipo es obligatorio (GASTO, INGRESO o AMBOS)")
    private TipoCategoria tipo;
}
