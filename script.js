// Modelo de regresión lineal
class LinearRegressionModel {
    constructor() {
        // Coeficientes obtenidos de un modelo entrenado previamente
        this.coefficients = {
            altura: -0.018,
            peso: 0.071,
            bias: 2.44
        };
    }

    predict(altura, peso) {
        return this.coefficients.altura * altura + this.coefficients.peso * peso + this.coefficients.bias;
    }
}

// Clasificación del IMC
function classifyBMI(bmi) {
    if (bmi < 18.5) return { category: "Bajo peso", class: "underweight-text" };
    if (bmi < 25) return { category: "Peso normal", class: "normal-text" };
    if (bmi < 30) return { category: "Sobrepeso", class: "overweight-text" };
    return { category: "Obesidad", class: "obesity-text" };
}

// Cálculo manual del IMC
function calculateBMI(weight, height) {
    return weight / Math.pow(height / 100, 2);
}

// Generador de datos aleatorios
function generateRandomData(numPoints) {
    const data = [];
    for (let i = 0; i < numPoints; i++) {
        // Altura normalmente distribuida alrededor de 170 cm
        const height = Math.max(140, Math.min(210, 170 + (Math.random() - 0.5) * 40));
        
        // Peso relacionado con la altura más ruido aleatorio
        const weight = height * 0.6 - 50 + (Math.random() - 0.5) * 20;
        
        // Calculamos el IMC real
        const realBMI = calculateBMI(weight, height);
        
        data.push({
            height,
            weight,
            realBMI
        });
    }
    return data;
}

// Visualización de datos
function visualizeData(data, model) {
    const ctx = document.getElementById('data-chart').getContext('2d');
    const tableBody = document.querySelector('#data-table tbody');
    
    // Limpiar tabla
    tableBody.innerHTML = '';
    
    // Preparar datos para el gráfico (muestrear si hay muchos puntos)
    const sampleSize = Math.min(100, data.length);
    const step = Math.max(1, Math.floor(data.length / sampleSize));
    const sampledData = [];
    const labels = [];
    const realBMIs = [];
    const predictedBMIs = [];
    
    for (let i = 0; i < data.length; i += step) {
        const point = data[i];
        const predictedBMI = model.predict(point.height, point.weight);
        
        sampledData.push(point);
        labels.push(`Punto ${i+1}`);
        realBMIs.push(point.realBMI);
        predictedBMIs.push(predictedBMI);
        
        // Añadir fila a la tabla (mostramos solo algunos puntos)
        if (i % Math.max(1, Math.floor(data.length / 10)) === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${point.height.toFixed(1)}</td>
                <td>${point.weight.toFixed(1)}</td>
                <td>${point.realBMI.toFixed(2)}</td>
                <td>${predictedBMI.toFixed(2)}</td>
            `;
            tableBody.appendChild(row);
        }
    }
    
    // Destruir gráfico anterior si existe
    if (window.dataChart) {
        window.dataChart.destroy();
    }
    
    // Crear nuevo gráfico
    window.dataChart = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [
                {
                    label: 'Datos reales',
                    data: sampledData.map(point => ({
                        x: point.height,
                        y: point.weight,
                        realBMI: point.realBMI
                    })),
                    backgroundColor: 'rgba(52, 152, 219, 0.7)',
                    pointRadius: 5,
                    parsing: {
                        xAxisKey: 'x',
                        yAxisKey: 'y'
                    }
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Altura (cm)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Peso (kg)'
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const point = context.raw;
                            return [
                                `Altura: ${point.x.toFixed(1)} cm`,
                                `Peso: ${point.y.toFixed(1)} kg`,
                                `IMC real: ${point.realBMI.toFixed(2)}`
                            ];
                        }
                    }
                }
            }
        }
    });
}

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', function() {
    const model = new LinearRegressionModel();
    const calculateBtn = document.getElementById('calculate-btn');
    const generateBtn = document.getElementById('generate-btn');
    const dataPointsSlider = document.getElementById('data-points');
    const dataCountDisplay = document.getElementById('data-count');
    const resultDiv = document.getElementById('result');
    
    // Generar datos iniciales
    let currentData = generateRandomData(50);
    visualizeData(currentData, model);
    
    // Configurar evento del slider
    dataPointsSlider.addEventListener('input', function() {
        dataCountDisplay.textContent = this.value;
    });
    
    // Configurar botón de generación
    generateBtn.addEventListener('click', function() {
        const numPoints = parseInt(dataPointsSlider.value);
        currentData = generateRandomData(numPoints);
        visualizeData(currentData, model);
    });
    
    // Configurar calculadora
    calculateBtn.addEventListener('click', function() {
        const height = parseFloat(document.getElementById('height').value);
        const weight = parseFloat(document.getElementById('weight').value);
        
        if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
            alert("Por favor ingresa valores válidos para altura y peso.");
            return;
        }
        
        // Calcular IMC real
        const realBMI = calculateBMI(weight, height);
        const realClassification = classifyBMI(realBMI);
        
        // Predecir IMC con el modelo
        const predictedBMI = model.predict(height, weight);
        const predictedClassification = classifyBMI(predictedBMI);
        
        // Mostrar resultados
        document.getElementById('bmi-calculated').textContent = realBMI.toFixed(2);
        document.getElementById('bmi-predicted').textContent = predictedBMI.toFixed(2);
        
        const realClassElement = document.getElementById('real-classification');
        realClassElement.textContent = realClassification.category;
        realClassElement.className = `classification ${realClassification.class}`;
        
        const predictedClassElement = document.getElementById('predicted-classification');
        predictedClassElement.textContent = predictedClassification.category;
        predictedClassElement.className = `classification ${predictedClassification.class}`;
        
        const differenceElement = document.getElementById('difference');
        const difference = Math.abs(realBMI - predictedBMI);
        differenceElement.textContent = `Diferencia: ${difference.toFixed(2)} (${((difference / realBMI) * 100).toFixed(1)}%)`;
        
        resultDiv.style.display = 'block';
        
        // Añadir el punto a los datos (para visualización)
        currentData.push({
            height,
            weight,
            realBMI
        });
        visualizeData(currentData, model);
    });
    
    // Valores por defecto para demostración
    document.getElementById('height').value = 170;
    document.getElementById('weight').value = 70;
});