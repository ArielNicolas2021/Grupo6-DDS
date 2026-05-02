package com.example.app.controllers;

import com.example.app.models.Ingreso;
import com.example.app.services.IngresoService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/ingresos")
@RequiredArgsConstructor
public class IngresoController {

    private final IngresoService ingresoService;

    @GetMapping
    public ResponseEntity<List<Ingreso>> getAll() {
        return ResponseEntity.ok(ingresoService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ingreso> getById(@PathVariable Long id) {
        return ingresoService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Ingreso>> getByUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(ingresoService.findByUsuarioId(usuarioId));
    }

    // GET /api/ingresos/usuario/1/rango?desde=2024-01-01&hasta=2024-01-31
    @GetMapping("/usuario/{usuarioId}/rango")
    public ResponseEntity<List<Ingreso>> getByUsuarioAndFecha(
            @PathVariable Long usuarioId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate desde,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate hasta) {
        return ResponseEntity.ok(ingresoService.findByUsuarioIdAndFechaBetween(usuarioId, desde, hasta));
    }

    // GET /api/ingresos/usuario/1/total?desde=2024-01-01&hasta=2024-01-31
    @GetMapping("/usuario/{usuarioId}/total")
    public ResponseEntity<BigDecimal> getTotalByUsuarioAndFecha(
            @PathVariable Long usuarioId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate desde,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate hasta) {
        return ResponseEntity.ok(ingresoService.sumMontoByUsuarioIdAndFechaBetween(usuarioId, desde, hasta));
    }

    @PostMapping
    public ResponseEntity<Ingreso> create(@RequestBody Ingreso ingreso) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ingresoService.save(ingreso));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        ingresoService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
