// Modelo de regresión lineal implementado con TensorFlow.js
class LinearRegressionModel {
    constructor() {
        this.model = null;
        this.weights = {
            altura: 0,
            peso: 0,
            bias: 0
        };
        this.initializeModel();
    }

    async initializeModel() {
        // En una implementación real, aquí cargaríamos un modelo pre-entrenado
        // Para este ejemplo, usaremos coeficientes simulados basados en la relación IMC = peso / (altura/100)^2
        
        // Simulamos coeficientes de un modelo entrenado
        this.weights = {
            altura: -0.018,  // Coeficiente para altura
            peso: 0.071,     // Coeficiente para peso
            bias: 2.44       // Intercepto
        };
        
        console.log("Modelo inicializado con coeficientes simulados");
    }

    predict(altura, peso) {
        // Realizar la predicción usando los coeficientes del modelo
        const prediction = this.weights.altura * altura + this.weights.peso * peso + this.weights.bias;
        return prediction;
    }
}

// Clasificación del IMC
function classifyBMI(bmi) {
    if (bmi < 18.5) return { category: "Bajo peso", class: "underweight" };
    if (bmi < 25) return { category: "Peso normal", class: "normal" };
    if (bmi < 30) return { category: "Sobrepeso", class: "overweight" };
    return { category: "Obesidad", class: "obesity" };
}

// Cálculo manual del IMC
function calculateBMI(weight, height) {
    return weight / Math.pow(height / 100, 2);
}

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', function() {
    const model = new LinearRegressionModel();
    const calculateBtn = document.getElementById('calculate-btn');
    const resultDiv = document.getElementById('result');
    let bmiChart = null;

    calculateBtn.addEventListener('click', function() {
        const height = parseFloat(document.getElementById('height').value);
        const weight = parseFloat(document.getElementById('weight').value);

        if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
            alert("Por favor ingresa valores válidos para altura y peso.");
            return;
        }

        // Calcular IMC real (fórmula matemática)
        const realBMI = calculateBMI(weight, height);
        const realClassification = classifyBMI(realBMI);

        // Predecir IMC con el modelo
        const predictedBMI = model.predict(height, weight);
        const predictedClassification = classifyBMI(predictedBMI);

        // Mostrar resultados
        document.getElementById('bmi-calculated').textContent = realBMI.toFixed(2);
        document.getElementById('bmi-predicted').textContent = predictedBMI.toFixed(2);
        
        const classificationElement = document.getElementById('bmi-classification');
        classificationElement.textContent = predictedClassification.category;
        classificationElement.className = predictedClassification.class;

        resultDiv.style.display = 'block';

        // Actualizar gráfico
        updateChart(realBMI, predictedBMI);
    });

    // Función para crear/actualizar el gráfico
    function updateChart(realBMI, predictedBMI) {
        const ctx = document.getElementById('bmi-chart').getContext('2d');
        
        if (bmiChart) {
            bmiChart.destroy();
        }

        bmiChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['IMC Real', 'IMC Predicho'],
                datasets: [{
                    label: 'Valor de IMC',
                    data: [realBMI, predictedBMI],
                    backgroundColor: [
                        'rgba(54, 162, 235, 0.7)',
                        'rgba(75, 192, 192, 0.7)'
                    ],
                    borderColor: [
                        'rgba(54, 162, 235, 1)',
                        'rgba(75, 192, 192, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Valor de IMC'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: ${context.raw.toFixed(2)}`;
                            }
                        }
                    }
                }
            }
        });
    }

    // Ejemplo de inicialización con valores por defecto
    document.getElementById('height').value = 170;
    document.getElementById('weight').value = 70;
});