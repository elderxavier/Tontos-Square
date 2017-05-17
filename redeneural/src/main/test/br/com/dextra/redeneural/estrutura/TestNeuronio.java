package br.com.dextra.redeneural.estrutura;
import org.junit.Assert;
import org.junit.Test;

import br.com.dextra.redeneural.estrutura.Neuronio;

public class TestNeuronio {

	@Test
	public void testPropagarSinais() {
		Neuronio neuronio = new FakeNeuronio(2);
		Double sinal = neuronio.propagarSinais(new Double[] {0d, 1d});
		Assert.assertEquals(new Double(.73), sinal, .1d);
	}

	class FakeNeuronio extends Neuronio {
		public FakeNeuronio(Integer nrConexoesEntrada) {
			super(nrConexoesEntrada);
		}

		@Override
		protected void inicializarConexoes() {
			for (int i = 0; i < conexoes.length; i++) {
				conexoes[i] = 1d;
			}
		}
	}

}