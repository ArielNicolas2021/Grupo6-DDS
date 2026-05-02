package com.example.app.services;

import com.example.app.models.Gasto;
import com.example.app.repositories.GastoRepository;
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
public class GastoService {

    private final GastoRepository gastoRepository;

    @Transactional(readOnly = true)
    public List<Gasto> findAll() {
        return gastoRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Gasto> findById(Long id) {
        return gastoRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public List<Gasto> findByUsuarioId(Long usuarioId) {
        return gastoRepository.findByUsuarioId(usuarioId);
    }

    @Transactional(readOnly = true)
    public List<Gasto> findByUsuarioIdAndFechaBetween(Long usuarioId, LocalDate desde, LocalDate hasta) {
        return gastoRepository.findByUsuarioIdAndFechaBetween(usuarioId, desde, hasta);
    }

    @Transactional(readOnly = true)
    public BigDecimal sumMontoByUsuarioIdAndFechaBetween(Long usuarioId, LocalDate desde, LocalDate hasta) {
        return gastoRepository.sumMontoByUsuarioIdAndFechaBetween(usuarioId, desde, hasta);
    }

    public Gasto save(Gasto gasto) {
        return gastoRepository.save(gasto);
    }

    public void deleteById(Long id) {
        gastoRepository.deleteById(id);
    }
}
