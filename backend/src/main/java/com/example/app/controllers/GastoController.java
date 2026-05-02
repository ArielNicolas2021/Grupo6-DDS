package com.example.app.controllers;

import com.example.app.models.Gasto;
import com.example.app.services.GastoService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/gastos")
@RequiredArgsConstructor
public class GastoController {

    private final GastoService gastoService;

    @GetMapping
    public ResponseEntity<List<Gasto>> getAll() {
        return ResponseEntity.ok(gastoService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Gasto> getById(@PathVariable Long id) {
        return gastoService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Gasto>> getByUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(gastoService.findByUsuarioId(usuarioId));
    }

    // GET /api/gastos/usuario/1/rango?desde=2024-01-01&hasta=2024-01-31
    @GetMapping("/usuario/{usuarioId}/rango")
    public ResponseEntity<List<Gasto>> getByUsuarioAndFecha(
            @PathVariable Long usuarioId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate desde,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate hasta) {
        return ResponseEntity.ok(gastoService.findByUsuarioIdAndFechaBetween(usuarioId, desde, hasta));
    }

    // GET /api/gastos/usuario/1/total?desde=2024-01-01&hasta=2024-01-31
    @GetMapping("/usuario/{usuarioId}/total")
    public ResponseEntity<BigDecimal> getTotalByUsuarioAndFecha(
            @PathVariable Long usuarioId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate desde,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate hasta) {
        return ResponseEntity.ok(gastoService.sumMontoByUsuarioIdAndFechaBetween(usuarioId, desde, hasta));
    }

    @PostMapping
    public ResponseEntity<Gasto> create(@RequestBody Gasto gasto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(gastoService.save(gasto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        gastoService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
