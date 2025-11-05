package com.unicesumar.java.controller;

import com.unicesumar.java.entity.Usuario;
import com.unicesumar.java.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping
    public Usuario criar(@RequestBody Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    @GetMapping
    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    @PostMapping("/{id}/multa")
    public ResponseEntity<String> aplicarMulta(@PathVariable Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));

        double novaMulta = usuario.getMultaPendente() + 10.0;
        usuario.setMultaPendente(novaMulta);
        usuarioRepository.save(usuario);

        return ResponseEntity.ok("Multa de R$ 10,00 aplicada ao usuário " + usuario.getNome());
    }

    @PostMapping("/{id}/retirar-multa")
    public ResponseEntity<String> retirarMulta(@PathVariable Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));

        usuario.setMultaPendente(0.0);
        usuarioRepository.save(usuario);

        return ResponseEntity.ok("Multa removida com sucesso do usuário " + usuario.getNome());
    }
}