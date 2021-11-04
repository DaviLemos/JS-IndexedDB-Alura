import { HttpService } from './HttpService';
import { ConnectionFactory } from './ConnectionFactory';
import { NegociacaoDao } from '../dao/NegociacaoDao';
import { Negociacao } from '../models/Negociacao';

export class NegociacaoService {
  constructor() {
    this._http = new HttpService();
  }

  obterNegociacoesDaSemana() {
    return this._http
      .get('negociacoes/semana')
      .then((negociacoes) =>
        negociacoes.map(
          (objeto) =>
            new Negociacao(
              new Date(objeto.data),
              objeto.quantidade,
              objeto.valor
            )
        )
      )
      .catch((erro) => {
        console.log(erro);
        throw new Error('Não foi possível obter as negociações da semana');
      });
  }

  obterNegociacoesDaAnterior() {
    return this._http
      .get('negociacoes/anterior')
      .then((negociacoes) =>
        negociacoes.map(
          (objeto) =>
            new Negociacao(
              new Date(objeto.data),
              objeto.quantidade,
              objeto.valor
            )
        )
      )
      .catch((erro) => {
        console.log(erro);
        throw new Error(
          'Não foi possível obter as negociações da semana anterior'
        );
      });
  }

  obterNegociacoesDaRetrasada() {
    return this._http
      .get('negociacoes/retrasada')
      .then((negociacoes) =>
        negociacoes.map(
          (objeto) =>
            new Negociacao(
              new Date(objeto.data),
              objeto.quantidade,
              objeto.valor
            )
        )
      )
      .catch((erro) => {
        console.log(erro);
        throw new Error(
          'Não foi possível obter as negociações da semana retrasada'
        );
      });
  }

  obterNegociacoes() {
    return Promise.all([
      this.obterNegociacoesDaSemana(),
      this.obterNegociacoesDaAnterior(),
      this.obterNegociacoesDaRetrasada(),
    ])
      .then((peridos) => {
        let negociacoes = peridos.reduce(
          (arrayAchatado, array) => arrayAchatado.concat(array),
          []
        );
        return negociacoes;
      })
      .catch((erro) => {
        throw new Error(erro);
      });
  }

  cadastra(negociacao) {
    return ConnectionFactory.getConnection()
      .then((connection) => new NegociacaoDao(connection))
      .then((dao) => dao.adiciona(negociacao))
      .then(() => 'Negociação adicionada com sucesso!')
      .catch((erro) => {
        console.log(erro);
        throw new Error('Não foi possível adicionar a negociação');
      });
  }

  lista() {
    return ConnectionFactory.getConnection()
      .then((connection) => new NegociacaoDao(connection))
      .then((dao) => dao.listaTodos())
      .catch((erro) => {
        console.log(erro);
        throw new Error('Não foi possível obter as negociações');
      });
  }

  apaga() {
    return ConnectionFactory.getConnection()
      .then((connection) => new NegociacaoDao(connection))
      .then((dao) => dao.apagaTodos())
      .then(() => 'Negociações apagadas com sucesso')
      .catch((erro) => {
        console.log(erro);
        throw new Error('Não foi possível apagar as negociações');
      });
  }

  importa(listaAtural) {
    return this.obterNegociacoes()
      .then((negociacoes) =>
        negociacoes.filter(
          (negociacao) =>
            !listaAtural.some((negociacaoExistente) =>
              negociacao.isEquals(negociacaoExistente)
            )
        )
      )
      .catch((erro) => {
        console.log(erro);
        throw new Error('Não foi possivel buscar negociações para importar');
      });
  }
}
