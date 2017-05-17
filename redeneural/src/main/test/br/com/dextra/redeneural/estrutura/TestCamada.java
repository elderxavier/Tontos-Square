package br.com.dextra.redeneural.estrutura;

import org.junit.Assert;
import org.junit.Test;

import br.com.dextra.redeneural.estrutura.Camada;

public class TestCamada {

	@Test
	public void testPropagarSinais() {
		Camada camada = new FakeCamada(2, 3);
		Double saida[] = camada.propagarSinais(new Double[] { 0d, 0d, 1d });
		final Double esperado = 0.7310585786300049d;
		Assert.assertArrayEquals(new Double[]{esperado, esperado}, saida);
	}

	class FakeCamada extends Camada {
		public FakeCamada(Integer nrNeuronios, Integer nrConexoesEntrada) {
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