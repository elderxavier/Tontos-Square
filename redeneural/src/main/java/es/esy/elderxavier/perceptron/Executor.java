package es.esy.elderxavier.perceptron;

public class Executor {

    private static final Double[][] AMOSTRAS = new Double[][]{
        {1d, 1d, 1d, 1d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 1d},
        {0d, 0d, 0d, 0d, 1d, 1d, 1d, 1d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 1d},
        {1d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 1d, 1d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 1d},
        {0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 1d, 1d, 1d, 1d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 1d},
        {0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 1d, 1d, 1d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 1d},
        {0d, 0d, 1d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 1d, 1d, 1d, 0d, 0d, 0d, 0d, 0d, 1d},
        {0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 1d, 0d, 0d, 0d, 0d, 1d, 1d, 0d, 0d, 0d, 1d},
        {0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 1d, 0d, 0d, 0d, 0d, 0d, 0d, 1d, 1d, 0d, 1d},
        {0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 1d, 0d, 1d, 0d, 0d, 0d, 0d, 0d, 0d, 1d, 0d, 1d, 1d}
    };

    private static final Double[] ESPERADOS = new Double[]{1d, 0d, 0d, 1d, 0d, 1d, 0d, 1d, 1d};

    public static void main(String[] args) {
        // Treino.
        Neuronio rede = new Neuronio(AMOSTRAS, ESPERADOS);
        rede.treinar();

        // Teste.
        Double s1 = rede.classificar(new Double[]{0d, 0d, 1d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 1d, 0d, 0d, 1d, 0d, 1d, 1d});
        Double s2 = rede.classificar(new Double[]{1d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 1d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 1d, 0d, 0d, 0d, 0d, 1d});

        System.out.println(s1 + " e " + s2);
        System.out.println(rede.getEpocas());
    }

}
