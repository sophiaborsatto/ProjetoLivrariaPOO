package com.unicesumar.java.entity;

// Importações novas que você precisa
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

import jakarta.persistence.*;

@JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME,
        include = JsonTypeInfo.As.PROPERTY,
        property = "tipo_item"
)
@JsonSubTypes({
        @JsonSubTypes.Type(value = Livro.class, name = "LIVRO"),
        @JsonSubTypes.Type(value = Periodico.class, name = "PERIODICO")
})
@Entity
@Table(name = "item_acervo_tbl")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "TIPO_ITEM", discriminatorType = DiscriminatorType.STRING)
public abstract class ItemAcervo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;
    private Integer anoPublicacao;
    private boolean disponivel = true;

    // ... (Seus Getters e Setters continuam aqui iguais)
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public Integer getAnoPublicacao() {
        return anoPublicacao;
    }

    public void setAnoPublicacao(Integer anoPublicacao) {
        this.anoPublicacao = anoPublicacao;
    }

    public boolean isDisponivel() {
        return disponivel;
    }

    public void setDisponivel(boolean disponivel) {
        this.disponivel = disponivel;
    }
}