package com.unicesumar.java.service;

import com.unicesumar.java.entity.Livro;
import com.unicesumar.java.repository.LivroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LivroService {
    @Autowired
    private LivroRepository livroRepository;
    public List <Livro> listarTodos (){
        return livroRepository.findAll();
    }
    public Livro criar (Livro livro){
        return livroRepository.save(livro);
    }
    public ResponseEntity <Livro> buscarPorId (Long id){
        return livroRepository.findById(id)
            .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound()
                        .build());
    }

    public ResponseEntity <Livro> atualizar (Long id, Livro dados){
        return livroRepository.findById(id)
                .map(livro -> {
                    livro.setTitulo(dados.getTitulo());
                    livro.setAutor(dados.getAutor());
                    livro.setAno(dados.getAno());
                    livroRepository.save(livro);
                    return ResponseEntity.ok(livro);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    public ResponseEntity<Object> deletar (Long id){
        return livroRepository.findById(id)
                .map(livro -> {
                    livroRepository.delete(livro);
                    return ResponseEntity.noContent().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}

