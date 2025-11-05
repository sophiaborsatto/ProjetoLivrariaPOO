package com.unicesumar.java.service;

import com.unicesumar.java.entity.Emprestimo;
import com.unicesumar.java.entity.ItemAcervo;
import com.unicesumar.java.entity.Usuario;
import com.unicesumar.java.repository.EmprestimoRepository;
import com.unicesumar.java.repository.ItemAcervoRepository;
import com.unicesumar.java.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class EmprestimoService {

    private static final int DiasPadraoEmprestimo = 7;
    private static final double MultaDiaria = 1.50;

    @Autowired
    private EmprestimoRepository emprestimoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ItemAcervoRepository itemAcervoRepository;

    @Transactional
    public Emprestimo realizarEmprestimo(Long usuarioId, Long itemId) {

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado. ID: " + usuarioId));

        ItemAcervo item = itemAcervoRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item não encontrado. ID: " + itemId));

        validarPossibilidadeDeEmprestimo(usuario, item);

        item.setDisponivel(false);
        itemAcervoRepository.save(item);

        Emprestimo emprestimo = new Emprestimo();
        emprestimo.setUsuario(usuario);
        emprestimo.setItem(item);
        emprestimo.setDataEmprestimo(LocalDate.now());
        emprestimo.setDataPrevistaDevolucao(LocalDate.now().plusDays(DiasPadraoEmprestimo));

        return emprestimoRepository.save(emprestimo);
    }

    @Transactional
    public Emprestimo realizarDevolucao(Long emprestimoId) {
        Emprestimo emprestimo = emprestimoRepository.findById(emprestimoId)
                .orElseThrow(() -> new RuntimeException("Empréstimo não encontrado. ID: " + emprestimoId));

        if (emprestimo.getDataDevolucaoReal() != null) {
            throw new RuntimeException("Este item já foi devolvido no dia " + emprestimo.getDataDevolucaoReal());
        }

        ItemAcervo item = emprestimo.getItem();
        item.setDisponivel(true);
        itemAcervoRepository.save(item);

        emprestimo.setDataDevolucaoReal(LocalDate.now());

        calcularEAtribuirMulta(emprestimo);

        return emprestimoRepository.save(emprestimo);
    }

    private void validarPossibilidadeDeEmprestimo(Usuario usuario, ItemAcervo item) {

        if (!item.isDisponivel()) {
            throw new RuntimeException("O item '" + item.getTitulo() + "' não está disponível (já foi emprestado).");
        }

        if (usuario.getMultaPendente() > 0.0) {
            throw new RuntimeException("Usuário possui R$ " + usuario.getMultaPendente() + " em multas pendentes.");
        }

        boolean temAtraso = emprestimoRepository.existsByUsuarioIdAndDataDevolucaoRealIsNullAndDataPrevistaDevolucaoBefore(
                usuario.getId(), LocalDate.now()
        );
        if (temAtraso) {
            throw new RuntimeException("Usuário possui itens em atraso. Devolva-os primeiro.");
        }

        int emprestimosAtivos = emprestimoRepository.countByUsuarioIdAndDataDevolucaoRealIsNull(usuario.getId());
        if (emprestimosAtivos >= usuario.getLimiteEmprestimo()) {
            throw new RuntimeException("Usuário atingiu o limite de " + usuario.getLimiteEmprestimo() + " empréstimos.");
        }
    }

    private void calcularEAtribuirMulta(Emprestimo emprestimo) {
        LocalDate dataDevolucao = emprestimo.getDataDevolucaoReal();
        LocalDate dataPrevista = emprestimo.getDataPrevistaDevolucao();

        if (dataDevolucao.isAfter(dataPrevista)) {
            long diasEmAtraso = ChronoUnit.DAYS.between(dataPrevista, dataDevolucao);

            if (diasEmAtraso > 0) {
                double multa = MultaDiaria * diasEmAtraso;

                Usuario usuario = emprestimo.getUsuario();
                double multaAtual = usuario.getMultaPendente();
                usuario.setMultaPendente(multaAtual + multa);
                usuarioRepository.save(usuario);
            }
        }
    }

    public List<Emprestimo> listarEmprestimosAtivosUsuario(Long usuarioId) {
        return emprestimoRepository.findByUsuarioIdAndDataDevolucaoRealIsNull(usuarioId);
    }
}