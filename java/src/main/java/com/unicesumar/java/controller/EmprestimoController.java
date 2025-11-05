package com.unicesumar.java.controller;

import com.unicesumar.java.entity.Emprestimo;
import com.unicesumar.java.repository.EmprestimoRepository;
import com.unicesumar.java.service.EmprestimoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/emprestimos")
public class EmprestimoController {

    @Autowired
    private EmprestimoService emprestimoService;

    @PostMapping
    public ResponseEntity<Emprestimo> realizarEmprestimo(@RequestBody EmprestimoRequest request) {
        Emprestimo emprestimo = emprestimoService.realizarEmprestimo(
                request.getUsuarioId(),
                request.getItemId()
        );
        return ResponseEntity.ok(emprestimo);
    }

    @PostMapping("/{id}/devolver")
    public ResponseEntity<Emprestimo> realizarDevolucao(@PathVariable Long id) {
        Emprestimo emprestimo = emprestimoService.realizarDevolucao(id);
        return ResponseEntity.ok(emprestimo);
    }

    @GetMapping("/usuario/{usuarioId}/ativos")
    public List<Emprestimo> listarEmprestimosAtivos(@PathVariable Long usuarioId) {
        return emprestimoService.listarEmprestimosAtivosUsuario(usuarioId);
    }

    static class EmprestimoRequest {
        private Long usuarioId;
        private Long itemId;

        public Long getUsuarioId() {
            return usuarioId;
        }

        public void setUsuarioId(Long usuarioId) {
            this.usuarioId = usuarioId;
        }

        public Long getItemId() {
            return itemId;
        }

        public void setItemId(Long itemId) {
            this.itemId = itemId;
        }
    }

    @Autowired
    private EmprestimoRepository emprestimoRepository;

    // --- Novo endpoint para listar todos os empréstimos ativos ---
    @GetMapping("/ativos")
    public List<Emprestimo> listarAtivos() {
        return emprestimoRepository.findByDataDevolucaoRealIsNull();
    }
}