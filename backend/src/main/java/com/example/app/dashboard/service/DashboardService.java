package com.example.app.dashboard.service;

import com.example.app.dashboard.dto.BalanceResponseDTO;
import com.example.app.exception.ResourceNotFoundException;
import com.example.app.models.Usuario;
import com.example.app.repositories.GastoRepository;
import com.example.app.repositories.IngresoRepository;
import com.example.app.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

/**
 * Servicio de dashboard financiero.
 *
 * Calcula el balance del usuario autenticado:
 *   balance = totalIngresos - totalGastos
 *
 * Precisión: BigDecimal con HALF_UP para evitar errores de redondeo.
 * Solo considera movimientos del usuario autenticado (aislamiento total).
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class DashboardService {

    private final GastoRepository gastoRepository;
    private final IngresoRepository ingresoRepository;
    private final UsuarioRepository usuarioRepository;

    public BalanceResponseDTO calcularBalance() {
        Usuario usuario = getUsuarioAutenticado();
        Long usuarioId = usuario.getId();

        log.debug("Calculando balance para usuario: {}", usuario.getEmail());

        // Totales monetarios — COALESCE en la query garantiza BigDecimal != null
        BigDecimal totalIngresos = ingresoRepository.sumTotalByUsuarioId(usuarioId);
        BigDecimal totalGastos   = gastoRepository.sumTotalByUsuarioId(usuarioId);

        // Contadores de movimientos
        long cantidadIngresos = ingresoRepository.countByUsuarioId(usuarioId);
        long cantidadGastos   = gastoRepository.countByUsuarioId(usuarioId);

        // Balance = Ingresos - Gastos (precisión exacta con BigDecimal)
        BigDecimal balance = totalIngresos.subtract(totalGastos);

        log.debug("Balance calculado → ingresos: {}, gastos: {}, balance: {}",
                totalIngresos, totalGastos, balance);

        return BalanceResponseDTO.builder()
                .totalIngresos(totalIngresos)
                .totalGastos(totalGastos)
                .balance(balance)
                .cantidadIngresos(cantidadIngresos)
                .cantidadGastos(cantidadGastos)
                .build();
    }

    private Usuario getUsuarioAutenticado() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Usuario autenticado no encontrado: " + email));
    }
}
