package com.unicesumar.java.controller;

import com.unicesumar.java.entity.Usuario;
import com.unicesumar.java.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
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
}