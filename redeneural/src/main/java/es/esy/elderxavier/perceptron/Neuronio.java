package es.esy.elderxavier.perceptron;

public class Neuronio {

	private static final Double taxaAprendizado = .05d;

	private Double[] esperados;
	private Double[][] amostras;
	private Double[] pesos;
	private int epocas;

	public Neuronio(Double[][] amostras, Double[] esperados) {
		this.esperados = esperados;
		this.amostras = amostras;
		this.epocas = 0;
		this.atribuirValoresAleatoriosParaPesos();
	}

	public void treinar() {
		Boolean erro;
		do {
			erro = Boolean.FALSE;
			for (int i = 0; i < amostras.length; i++) {
				Double u = this.integrarSinal(i);
				Double saida = this.calcularSinalSaida(u);
				if (!saida.equals(esperados[i])) {
					this.aprender(saida, i);
					erro = Boolean.TRUE;
				}
			}
			epocas++;
		} while (erro && epocas < 10000);
	}

	public Double classificar(Double[] padrao) {
		Double u = 0d;
		for (int i = 0; i < pesos.length; i++) {
			u += pesos[i] * padrao[i];
		}
		return this.calcularSinalSaida(u);
	}

	private Double integrarSinal(int i) {
		Double u = 0d;
		for (int j = 0; j < pesos.length; j++) {
			u += pesos[j] * amostras[i][j];
		}
		return u;
	}

	private void aprender(Double saida, int i) {
		Double fatorAprendizado = Neuronio.taxaAprendizado * (esperados[i] - saida);
		for (int j = 0; j < pesos.length; j++) {
			pesos[j] += fatorAprendizado * amostras[i][j];
		}
	}

	private void atribuirValoresAleatoriosParaPesos() {
		pesos = new Double[amostras[0].length];
		for (int i = 0; i < pesos.length; i++) {
			pesos[i] = Math.random();
		}
	}

	private Double calcularSinalSaida(Double u) {
		return (u >= 0.5d) ? 1d : 0d;
	}

	public int getEpocas() {
		return epocas;
	}

	public Double[] getPesos() {
		return pesos;
	}

}