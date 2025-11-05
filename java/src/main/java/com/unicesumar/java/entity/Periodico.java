package com.unicesumar.java.entity;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

@Entity
@DiscriminatorValue("PERIODICO")
public class Periodico extends ItemAcervo {

    public enum TipoPeriodico {
        REVISTA,
        JORNAL
    }

    @Enumerated(EnumType.STRING)
    private TipoPeriodico tipo;

    public TipoPeriodico getTipo() {
        return tipo;
    }

    public void setTipo(TipoPeriodico tipo) {
        this.tipo = tipo;
    }
}