package br.com.dextra.redeneural.estrutura;

import org.junit.Assert;
import org.junit.Test;

import br.com.dextra.redeneural.estrutura.CamadaIntermediaria;
import br.com.dextra.redeneural.estrutura.PerceptronMultiplasCamadas;

public class TestPerceptronMultiplasCamadas {

	@Test
	public void testPropagarSinais() {
		PerceptronMultiplasCamadas mlp = new FakePerceptronMultiplasCamadas(4, 3, 2);
		Double sinal[] = mlp.propagarSinais(new Double[] { 1d, 1d, 1d, 1d });
		final Double esperado = 0.9500760587096172d;
		Assert.assertArrayEquals(new Double[]{esperado, esperado}, sinal);
	}

	public class FakePerceptronMultiplasCamadas extends PerceptronMultiplasCamadas {
		public FakePerceptronMultiplasCamadas(Integer nrEntradas, Integer nrNeuroniosCamadaIntermediaria, Integer nrNeuroniosCamadaSaida) {
			super(nrEntradas, nrNeuroniosCamadaIntermediaria, nrNeuroniosCamadaSaida);
			TestCamada testCamada = new TestCamada();
			this.camadaIntermediaria = new FakeCamadaIntermediaria(nrNeuroniosCamadaIntermediaria, nrEntradas);
			this.camadaSaida = testCamada.new FakeCamada(nrNeuroniosCamadaSaida, nrNeuroniosCamadaIntermediaria);
		}
	}

	class FakeCamadaIntermediaria extends CamadaIntermediaria {
		public FakeCamadaIntermediaria(Integer nrNeuronios, Integer nrConexoesEntrada) {
			super(nrNeuronios, nrConexoesEntrada);
		}

		@Override
		protected void inicializarNeuronios(Integer nrConexoesEntrada) {
			TestNeuronio testNeuronio = new TestNeuronio();
			for (int i = 0; i < neuronios.length; i++) {
				neuronios[i] = testNeuronio.new FakeNeuronio(nrConexoesEntrada);
			}
		}
	}

}