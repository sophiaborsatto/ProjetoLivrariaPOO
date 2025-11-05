package com.unicesumar.java.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "usuario_tbl")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private int limiteEmprestimo = 5;
    private double multaPendente = 0.0;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public int getLimiteEmprestimo() {
        return limiteEmprestimo;
    }

    public void setLimiteEmprestimo(int limiteEmprestimo) {
        this.limiteEmprestimo = limiteEmprestimo;
    }

    public double getMultaPendente() {
        return multaPendente;
    }

    public void setMultaPendente(double multaPendente) {
        this.multaPendente = multaPendente;
    }
}