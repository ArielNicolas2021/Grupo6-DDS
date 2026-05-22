package com.example.app.services;

import com.example.app.models.Ingreso;
import com.example.app.repositories.IngresoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class IngresoService {

    private final IngresoRepository ingresoRepository;

    @Transactional(readOnly = true)
    public List<Ingreso> findAll() {
        return ingresoRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Ingreso> findById(Long id) {
        return ingresoRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public List<Ingreso> findByUsuarioId(Long usuarioId) {
        return ingresoRepository.findByUsuarioId(usuarioId);
    }

    @Transactional(readOnly = true)
    public List<Ingreso> findByUsuarioIdAndFechaBetween(Long usuarioId, LocalDate desde, LocalDate hasta) {
        return ingresoRepository.findByUsuarioIdAndFechaBetween(usuarioId, desde, hasta);
    }

    @Transactional(readOnly = true)
    public BigDecimal sumMontoByUsuarioIdAndFechaBetween(Long usuarioId, LocalDate desde, LocalDate hasta) {
        return ingresoRepository.sumMontoByUsuarioIdAndFechaBetween(usuarioId, desde, hasta);
    }

    public Ingreso save(Ingreso ingreso) {
        return ingresoRepository.save(ingreso);
    }

    public void deleteById(Long id) {
        ingresoRepository.deleteById(id);
    }
}
