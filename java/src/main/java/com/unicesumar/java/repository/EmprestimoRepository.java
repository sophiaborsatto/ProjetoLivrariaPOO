package com.unicesumar.java.repository;

import com.unicesumar.java.entity.Emprestimo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface EmprestimoRepository extends JpaRepository<Emprestimo, Long> {

    int countByUsuarioIdAndDataDevolucaoRealIsNull(Long usuarioId);

    boolean existsByUsuarioIdAndDataDevolucaoRealIsNullAndDataPrevistaDevolucaoBefore(Long usuarioId, LocalDate hoje);

    List<Emprestimo> findByUsuarioIdAndDataDevolucaoRealIsNull(Long usuarioId);
}