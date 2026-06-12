package com.example.app;

import com.example.app.models.Categoria;
import com.example.app.models.Categoria.TipoCategoria;
import com.example.app.repositories.CategoriaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Inicializa datos semilla al arrancar la aplicación.
 * También sirve como confirmación visual de que las tablas
 * fueron creadas correctamente por Hibernate.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final CategoriaRepository categoriaRepository;

    @Override
    public void run(String... args) {
        if (categoriaRepository.count() == 0) {
            log.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            log.info("  Inicializando categorías por defecto...");
            log.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

            List<Categoria> categorias = List.of(
                // Categorías de GASTO
                Categoria.builder().nombre("Alimentación")   .tipo(TipoCategoria.GASTO)   .descripcion("Supermercado, restaurantes, delivery").build(),
                Categoria.builder().nombre("Transporte")     .tipo(TipoCategoria.GASTO)   .descripcion("Combustible, transporte público, taxi").build(),
                Categoria.builder().nombre("Vivienda")       .tipo(TipoCategoria.GASTO)   .descripcion("Alquiler, expensas, servicios").build(),
                Categoria.builder().nombre("Salud")          .tipo(TipoCategoria.GASTO)   .descripcion("Medicamentos, consultas médicas").build(),
                Categoria.builder().nombre("Entretenimiento").tipo(TipoCategoria.GASTO)   .descripcion("Cine, streaming, salidas").build(),
                Categoria.builder().nombre("Educación")      .tipo(TipoCategoria.AMBOS)   .descripcion("Cursos, libros, capacitaciones").build(),
                // Categorías de INGRESO
                Categoria.builder().nombre("Salario")        .tipo(TipoCategoria.INGRESO) .descripcion("Ingreso mensual por empleo").build(),
                Categoria.builder().nombre("Freelance")      .tipo(TipoCategoria.INGRESO) .descripcion("Proyectos independientes").build(),
                Categoria.builder().nombre("Inversiones")    .tipo(TipoCategoria.INGRESO) .descripcion("Dividendos, intereses, renta").build(),
                Categoria.builder().nombre("Otros")          .tipo(TipoCategoria.AMBOS)   .descripcion("Ingresos o gastos varios").build()
            );

            categoriaRepository.saveAll(categorias);
            log.info("  ✅ {} categorías creadas exitosamente.", categorias.size());
        } else {
            log.info("  ✅ Categorías ya existentes: {}", categoriaRepository.count());
        }

        System.out.println("=========================================");
        System.out.println("Tablas verificadas:");
        System.out.println("  - usuarios");
        System.out.println("  - categorias");
        System.out.println("  - gastos");
        System.out.println("  - ingresos");
        System.out.println("Aplicación lista en http://localhost:8080");
        System.out.println("=========================================");
    }
}
