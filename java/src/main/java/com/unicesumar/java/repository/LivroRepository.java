package com.unicesumar.java.repository;

import com.unicesumar.java.entity.Livro;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LivroRepository extends JpaRepository <Livro, Long> {
}
