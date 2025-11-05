package com.unicesumar.java.controller;

import com.unicesumar.java.entity.ItemAcervo;
import com.unicesumar.java.repository.ItemAcervoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/itens")
public class ItemAcervoController {

    @Autowired
    private ItemAcervoRepository itemAcervoRepository;

    @PostMapping
    public ItemAcervo criar(@RequestBody ItemAcervo item) {
        return itemAcervoRepository.save(item);
    }

    @GetMapping
    public List<ItemAcervo> listarTodos() {
        return itemAcervoRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ItemAcervo> buscarPorId(@PathVariable Long id) {
        Optional<ItemAcervo> itemOpt = itemAcervoRepository.findById(id);

        if (itemOpt.isPresent()) {
            ItemAcervo item = itemOpt.get();
            return ResponseEntity.ok(item);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deletar(@PathVariable Long id) {
        if (itemAcervoRepository.existsById(id)) {
            itemAcervoRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}