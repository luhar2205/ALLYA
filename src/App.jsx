import React, { useState, useEffect, useRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import {
  BarChart as LucideBarChart,
  Users,
  HeartCrack,
  DollarSign,
  GraduationCap,
  Heart,
  ShieldCheck,
  Lightbulb,
  Target,
  Handshake,
  Globe,
  Sparkles,
  Rocket,
  Clock,
  AlertTriangle,
  Activity,
  Lock,
} from "lucide-react"; // Importando ícones Lucide, renomeando BarChart para evitar conflito

// --- DADOS REAIS E MOCK (SUBSTITUA COM SEUS DADOS ATUALIZADOS) ---
// Dados para a seção de Problema e Mercado
const problemStats = [
  {
    value: "38.1%",
    label: "Força de Trabalho Informal (Brasil)",
    icon: LucideBarChart,
    color: "bg-blue-600",
  },
  {
    value: "775 mil",
    label: "Trabalhadores Informais no ES",
    icon: Users,
    color: "bg-blue-700",
  },
  {
    value: "25.7%",
    label: "Cuidadores Informais Sobrecargados",
    icon: HeartCrack,
    color: "bg-blue-800",
  },
];

const marketOpportunityStats = [
  {
    value: "US$ 9.69 TRI",
    label: "Mercado Global de Serviços Domésticos Online (Proj. 2033)",
    icon: DollarSign,
    color: "bg-blue-600",
  },
  {
    value: "32.1 Milhões",
    label: "População 60+ no Brasil (15.6% e crescendo)",
    icon: Users,
    color: "bg-blue-700",
  },
];

const revenueProjectionData = [
  { name: "Mês 1", Receita: 13500, Custos: 15000 },
  { name: "Mês 3", Receita: 26200, Custos: 17000 },
  { name: "Mês 5", Receita: 42900, Custos: 19000 },
  { name: "Mês 7 (Proj.)", Receita: 54800, Custos: 21000 },
];

// DADOS DE CONCORRÊNCIA COM NOMES GENÉRICOS
const competitionData = [
  { name: "Plataforma de Serviços Diversos", value: 300, color: "#4299e1" }, // Azul claro
  { name: "App de Mão de Obra Geral", value: 200, color: "#3182ce" }, // Azul médio
  { name: "Serviços de Cuidado Específicos", value: 150, color: "#2b6cb0" }, // Azul escuro
  { name: "Plataforma Global de Cuidados", value: 100, color: "#2c5282" }, // Azul muito escuro
  { name: "Alia (Potencial)", value: 400, color: "#1a365d" }, // Azul quase preto para destaque
];

// NOVOS DADOS PARA A SEÇÃO DE VALIDAÇÃO
const validationChartData = [
  { name: "Indicações Informais", value: 70 },
  { name: "Desistência por Medo", value: 64 },
];

// Dados dos Membros do Time (mantidos para referência, não usados no layout atual)
const teamMembers = [
  {
    name: "Leticia G. Sá Bersan",
    role: "CEO & Estratégia",
    bio: "Visão de negócios e liderança. Foco em inovação e impacto social.",
    img: "https://placehold.co/150x150/4299e1/ffffff?text=Leticia",
  },
  {
    name: "Caroline Brandão Viana",
    role: "COO & Operações",
    bio: "Especialista em otimização de processos e experiência do usuário.",
    img: "https://placehold.co/150x150/3182ce/ffffff?text=Caroline",
  },
  {
    name: "Harley L. Marcelino",
    role: "CTO & Tecnologia",
    bio: "Arquiteto de soluções tecnológicas e inteligência artificial.",
    img: "https://placehold.co/150x150/2b6cb0/ffffff?text=Harley",
  },
  {
    name: "Maria Luisa Dialdina",
    role: "CMO & Marketing",
    bio: "Estrategista de marketing digital e comunicação de impacto.",
    img: "https://placehold.co/150x150/2c5282/ffffff?text=Maria",
  },
];

// --- COMPONENTES AUXILIARES ---

// Componente para títulos de seção estilizados
const SectionTitle = ({ children }) => (
  <h2 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-8 text-center relative pb-4">
    {children}
    <span className="block w-32 h-1.5 bg-blue-600 mx-auto mt-4 rounded-full shadow-lg"></span>
  </h2>
);

// Card com ícone Lucide, título e descrição
const IconCard = ({
  icon: IconComponent,
  title,
  description,
  bgColor,
  textColor,
}) => (
  <div
    className={`p-6 rounded-2xl shadow-lg transform hover:scale-105 transition duration-300 ease-in-out flex flex-col items-center ${bgColor} ${textColor} border border-blue-200`}
  >
    <div className="mb-4 text-4xl">
      <IconComponent className="w-12 h-12" />{" "}
      {/* Renderiza o componente Lucide */}
    </div>
    <h3 className="text-2xl font-bold mb-2 text-center">{title}</h3>
    <p className="text-center text-base">{description}</p>
  </div>
);

// Card de estatística com valor grande e ícone Lucide
const StatCard = ({ value, label, icon: IconComponent, color }) => (
  <div
    className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center justify-center text-center transform hover:scale-105 transition duration-300 ease-in-out min-h-[200px] border-b-4 border-l-4 border-opacity-60"
    style={{ borderColor: color.replace("bg-", "") }}
  >
    <div className={`p-3 rounded-full ${color} mb-3 shadow-md`}>
      <IconComponent className="w-10 h-10 text-white" />{" "}
      {/* Renderiza o componente Lucide */}
    </div>
    <p className="text-5xl font-extrabold text-gray-900 leading-tight">
      {value}
    </p>
    <p className="text-lg text-gray-600 mt-2">{label}</p>
  </div>
);

// Componente de Modal genérico
const Modal = ({ children, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-lg w-full text-center relative transform scale-95 animate-scale-up border-4 border-blue-400">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-3xl font-bold transition duration-200"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

// MODAL PARA DETALHES DO CUSTO INICIAL DO MVP
const MVPDetailsModal = ({ onClose }) => {
  return (
    <Modal onClose={onClose}>
      <h3 className="text-3xl font-bold text-blue-800 mb-6">
        Detalhamento de Custos Iniciais (MVP)
      </h3>
      <div className="text-left text-gray-700 space-y-3">
        <p className="text-xl font-semibold">
          Estimativa: R$ 50.500,00 - R$ 56.000,00
        </p>
        <ul className="list-disc list-inside ml-4 space-y-2">
          <li>
            <span className="font-semibold">
              Desenvolvimento da Plataforma (App e Web):
            </span>{" "}
            R$ 30.000 - R$ 35.000
          </li>
          <li>
            <span className="font-semibold">Design UX/UI Inicial:</span> R$
            5.000 - R$ 7.000
          </li>
          <li>
            <span className="font-semibold">
              Infraestrutura e Hospedagem (Primeiros Meses):
            </span>{" "}
            R$ 2.000 - R$ 3.000
          </li>
          <li>
            <span className="font-semibold">
              Marketing e Aquisição de Usuários (Fase Inicial):
            </span>{" "}
            R$ 8.000 - R$ 9.000
          </li>
          <li>
            <span className="font-semibold">
              Assessoria Jurídica e Contábil:
            </span>{" "}
            R$ 2.500 - R$ 2.000
          </li>
          <li>
            <span className="font-semibold">Contingência:</span> R$ 3.000 - R$ 0
          </li>
        </ul>
        <p className="mt-4 text-lg">
          Este orçamento visa a construção de um Produto Mínimo Viável robusto e
          funcional para validação de mercado.
        </p>
      </div>
    </Modal>
  );
};

// NOVO: Componente para a animação de texto digitando/apagando
const AnimatedTextDisplay = ({
  phrases,
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseTime = 1500,
}) => {
  const [currentText, setCurrentText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingDelay, setTypingDelay] = useState(typingSpeed);

  useEffect(() => {
    let timer;
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      setTypingDelay(deletingSpeed);
      timer = setTimeout(() => {
        setCurrentText(currentPhrase.substring(0, currentText.length - 1));
      }, typingDelay);
    } else {
      setTypingDelay(typingSpeed);
      timer = setTimeout(() => {
        setCurrentText(currentPhrase.substring(0, currentText.length + 1));
      }, typingDelay);
    }

    if (!isDeleting && currentText === currentPhrase) {
      timer = setTimeout(() => setIsDeleting(true), pauseTime);
    } else if (isDeleting && currentText === "") {
      setIsDeleting(false);
      setPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length);
    }

    return () => clearTimeout(timer);
  }, [
    currentText,
    isDeleting,
    phraseIndex,
    typingDelay,
    phrases,
    typingSpeed,
    deletingSpeed,
    pauseTime,
  ]);

  return (
    <span className="font-extrabold text-purple-600 inline-block min-h-[1.5em]">
      {currentText}
      <span className="animate-blink">|</span> {/* Cursor piscante */}
    </span>
  );
};

// --- COMPONENTE PRINCIPAL DO APP ---
const App = () => {
  const [activeSection, setActiveSection] = useState("welcome"); // Inicia na seção de boas-vindas
  const [currentAppScreen, setCurrentAppScreen] = useState("home"); // Para o mockup funcional
  const [showProblemModal, setShowProblemModal] = useState(false);
  const [selectedCompetitor, setSelectedCompetitor] = useState(null);
  const [showPricingSimulator, setShowPricingSimulator] = useState(false);
  const [showMVPDetailsModal, setShowMVPDetailsModal] = useState(false); // Novo estado para o modal MVP

  // Cronômetro de 5 minutos (300 segundos)
  const [timeLeft, setTimeLeft] = useState(300);
  const [timerRunning, setTimerRunning] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    // Garante que o timer só inicie se timerRunning for true e timeLeft > 0
    if (timerRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(timerRef.current);
      // Opcional: Adicionar alguma ação ao final do tempo, como navegar para a tela final
      // navigateTo('final-pitch'); // Descomente se quiser que o pitch finalize automaticamente
    }
    // Limpa o intervalo quando o componente é desmontado ou o timer para/reseta
    return () => clearInterval(timerRef.current);
  }, [timerRunning, timeLeft]); // Dependências: timerRunning e timeLeft

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(1, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Função para iniciar o pitch e o cronômetro
  const startPitch = () => {
    setTimeLeft(300); // Reseta o tempo para 5 minutos
    setTimerRunning(true);
    navigateTo("problem"); // Navega para a primeira seção de conteúdo
  };

  // Função para navegação suave entre as seções
  const navigateTo = (sectionId) => {
    setActiveSection(sectionId);
    // Adiciona um pequeno delay para garantir que o elemento esteja no DOM
    setTimeout(() => {
      document
        .getElementById(sectionId)
        ?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // Pricing Simulator State
  const [serviceType, setServiceType] = useState("cuidado-idoso");
  const [locationFactor, setLocationFactor] = useState(0); // 0, 0.05, 0.10
  const [urgency, setUrgency] = useState(false);
  const [specialHours, setSpecialHours] = useState(false);
  const [professionalReputation, setProfessionalReputation] = useState(4.0); // 1.0 to 5.0

  const basePrice = 50; // Example base price per hour

  const calculatePrice = () => {
    let price = basePrice;
    price *= 1 + locationFactor;
    if (urgency) price *= 1.2; // 20% premium for urgency
    if (specialHours) price *= 1.25; // 25% premium for special hours
    if (professionalReputation >= 4.8) price *= 1.1; // 10% premium for high reputation

    return price.toFixed(2);
  };

  // Mockup funcional do aplicativo
  const AppMockup = () => {
    switch (currentAppScreen) {
      case "home":
        return (
          <div className="bg-blue-50 p-6 rounded-xl shadow-inner text-center h-full flex flex-col justify-center items-center relative">
            {/* Notificação Fictícia */}
            <div className="absolute top-4 right-4 bg-red-500 text-white rounded-full p-2 text-xs font-bold animate-pulse">
              1 Nova Chamada!
            </div>
            <img
              src="https://i.ibb.co/3mRbJJhP/Alia-3x-2.png" // URL da logo da Alia
              alt="Logo da Alia"
              className="w-2/3 h-auto max-w-xs mx-auto mb-4 object-contain animate-bounce-slow" // Ajustado tamanho e proporção
            />
            <h4 className="text-3xl font-bold text-blue-900 mt-4">
              Bem-vindo à Alia!
            </h4>
            <p className="text-lg text-gray-700 mt-2">
              Seu parceiro de cuidado e acolhimento.
            </p>
            <button
              onClick={() => setCurrentAppScreen("calls")}
              className="mt-6 bg-blue-600 text-white py-2 px-6 rounded-full hover:bg-blue-700 transition duration-300 transform hover:scale-105"
            >
              Ver Chamadas
            </button>
          </div>
        );
      case "calls":
        return (
          <div className="bg-blue-50 p-6 rounded-xl shadow-inner h-full flex flex-col">
            <h4 className="text-2xl font-bold text-blue-900 mb-4 text-center">
              Suas Chamadas
            </h4>
            <div className="flex-grow overflow-y-auto space-y-3">
              <div className="bg-white p-3 rounded-lg shadow-sm border border-blue-200 animate-fade-in-up">
                <p className="font-semibold text-blue-800">
                  Chamada de Cuidado: Sr. João
                </p>
                <p className="text-sm text-gray-600">
                  "Olá, preciso de um cuidador para meu pai amanhã de manhã."
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Status: Pendente | 07/07/2025, 09:00
                </p>
                <button className="mt-2 text-blue-500 hover:underline text-sm">
                  Aceitar
                </button>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm border border-blue-200 animate-fade-in-up animate-delay-100">
                <p className="font-semibold text-blue-800">
                  Cuidado Pet: Gato Mia
                </p>
                <p className="text-sm text-gray-600">
                  "Preciso de alguém para alimentar meu gato enquanto viajo."
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Status: Confirmado | 08/07/2025, 14:00
                </p>
                <button className="mt-2 text-blue-500 hover:underline text-sm">
                  Ver Detalhes
                </button>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm border border-blue-200 animate-fade-in-up animate-delay-200">
                <p className="font-semibold text-blue-800">
                  Afazeres Domésticos: Limpeza Geral
                </p>
                <p className="text-sm text-gray-600">
                  "Procuro alguém para uma limpeza pesada na casa."
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Status: Finalizado | 01/07/2025
                </p>
                <button className="mt-2 text-blue-500 hover:underline text-sm">
                  Avaliar
                </button>
              </div>
            </div>
            <button
              onClick={() => setCurrentAppScreen("home")}
              className="mt-auto bg-gray-200 text-gray-700 py-2 px-4 rounded-full hover:bg-gray-300 transition duration-300"
            >
              Voltar
            </button>
          </div>
        );
      case "schedule-service": // Mantido, mas pode ser acessado via outra rota se necessário
        return (
          <div className="bg-blue-50 p-6 rounded-xl shadow-inner h-full flex flex-col">
            <h4 className="text-2xl font-bold text-blue-900 mb-4 text-center">
              Agendamento Inteligente (Alia AI)
            </h4>
            <p className="text-gray-700 mb-3">Selecione data e hora:</p>
            <input
              type="date"
              className="p-3 mb-3 rounded-lg border border-blue-200 focus:ring-blue-400 focus:border-blue-400"
            />
            <input
              type="time"
              className="p-3 mb-3 rounded-lg border border-blue-200 focus:ring-blue-400 focus:border-blue-400"
            />
            <p className="text-sm text-gray-600 mb-4">
              A Alia AI sugere os melhores horários e profissionais disponíveis
              para você.
            </p>
            <button className="bg-blue-600 text-white py-2 px-4 rounded-full hover:bg-blue-700 transition duration-300">
              Confirmar Agendamento
            </button>
            <button
              onClick={() => setCurrentAppScreen("home")}
              className="mt-auto bg-gray-200 text-gray-700 py-2 px-4 rounded-full hover:bg-gray-300 transition duration-300"
            >
              Voltar
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 font-inter text-gray-800">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-lg z-50 py-4 px-6 md:px-12 rounded-b-xl flex justify-between items-center border-b-4 border-blue-300">
        <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-lg font-semibold">
          <li>
            <button
              onClick={() => navigateTo("welcome")}
              className="text-blue-700 hover:text-blue-900 transition duration-300 rounded-full px-4 py-2 hover:bg-blue-100"
            >
              Início
            </button>
          </li>
          <li>
            <button
              onClick={() => navigateTo("problem")}
              className="text-blue-700 hover:text-blue-900 transition duration-300 rounded-full px-4 py-2 hover:bg-blue-100"
            >
              Problema
            </button>
          </li>
          <li>
            <button
              onClick={() => navigateTo("solution")}
              className="text-blue-700 hover:text-blue-900 transition duration-300 rounded-full px-4 py-2 hover:bg-blue-100"
            >
              Solução
            </button>
          </li>
          <li>
            <button
              onClick={() => navigateTo("market")}
              className="text-blue-700 hover:text-blue-900 transition duration-300 rounded-full px-4 py-2 hover:bg-blue-100"
            >
              Mercado
            </button>
          </li>
          <li>
            <button
              onClick={() => navigateTo("business-model")}
              className="text-blue-700 hover:text-blue-900 transition duration-300 rounded-full px-4 py-2 hover:bg-blue-100"
            >
              Negócios
            </button>
          </li>
          <li>
            <button
              onClick={() => navigateTo("validation")}
              className="text-blue-700 hover:text-blue-900 transition duration-300 rounded-full px-4 py-2 hover:bg-blue-100"
            >
              Validação
            </button>
          </li>
          <li>
            <button
              onClick={() => navigateTo("competition")}
              className="text-blue-700 hover:text-blue-900 transition duration-300 rounded-full px-4 py-2 hover:bg-blue-100"
            >
              Diferenciais
            </button>
          </li>
          <li>
            <button
              onClick={() => navigateTo("mission-vision-values-impacts")}
              className="text-blue-700 hover:text-blue-900 transition duration-300 rounded-full px-4 py-2 hover:bg-blue-100"
            >
              Nossa Essência
            </button>
          </li>
          <li>
            <button
              onClick={() => navigateTo("final-pitch")}
              className="text-blue-700 hover:text-blue-900 transition duration-300 rounded-full px-4 py-2 hover:bg-blue-100"
            >
              Finalizar
            </button>
          </li>
        </ul>
        <div
          className={`flex items-center text-xl font-bold ${
            timeLeft <= 60 ? "text-red-600 animate-pulse" : "text-blue-800"
          }`}
        >
          <Clock className="w-7 h-7 mr-2 text-blue-600" />{" "}
          {/* Usando ícone Lucide Clock */}
          {formatTime(timeLeft)}
        </div>
      </nav>

      <main className="pt-28 pb-16 px-4 md:px-8 max-w-6xl mx-auto">
        {/* 0. Welcome/Cover Section - Gancho/Abertura (30s) */}
        <section
          id="welcome"
          className="min-h-[calc(100vh-120px)] flex flex-col items-center justify-center text-center py-16"
        >
          <div className="bg-white p-8 md:p-16 rounded-3xl shadow-2xl max-w-4xl w-full animate-fade-in border-4 border-blue-400">
            {/* Logo da Alia - Proporcional e maior */}
            <img
              src="https://i.ibb.co/3mRbJJhP/Alia-3x-2.png" // URL da logo da Alia
              alt="Logo da Alia"
              className="w-2/3 h-auto max-w-md mx-auto mb-8 object-contain animate-pulse-fade" // Ajustado para ser maior e proporcional
            />
            <h1 className="text-5xl md:text-7xl font-extrabold text-blue-900 leading-tight mb-6 animate-slide-up">
              Alia: <span className="text-blue-700">A Essência do Cuidado</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto animate-fade-in-delay">
              <span className="font-semibold text-blue-700">
                Cuidar é se Alia(r)
              </span>
              : Conectando corações, transformando vidas com segurança e
              carinho.
            </p>
            <button
              onClick={startPitch}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-12 rounded-full shadow-lg transition duration-300 transform hover:scale-105 text-2xl"
            >
              Iniciar Pitch de 5 Minutos
            </button>
          </div>
        </section>

        {/* 1. Problem Section: The Emotional & Numerical Impact - Problema (60s) */}
        <section id="problem" className="py-16">
          <SectionTitle>
            O Problema: Uma Realidade Que Precisa Mudar
          </SectionTitle>
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border-4 border-blue-400">
            <h3 className="text-3xl font-bold text-blue-900 mb-8 text-center">
              A Informalidade e o Impacto Humano
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-12">
              {problemStats.map((stat, index) => (
                <StatCard
                  key={index}
                  value={stat.value}
                  label={stat.label}
                  icon={stat.icon} // Usando componente Lucide
                  color={stat.color}
                />
              ))}
            </div>

            <h3 className="text-3xl font-bold text-blue-900 mb-6 text-center">
              O Custo Oculto: O Caso Hospital Santa Rita
            </h3>
            <div className="bg-blue-50 p-6 rounded-2xl shadow-inner border-l-4 border-blue-600 animate-fade-in-delay">
              <p className="text-xl text-gray-700 leading-relaxed text-center">
                Pesquisas com o Hospital Santa Rita (Vitória/ES) revelam:
                <br />
                "Alto índice de{" "}
                <span className="font-bold text-blue-800">
                  abandono de pacientes em leitos por carência de apoio
                  domiciliar
                </span>{" "}
                após alta."
                <br />
                Isso gera{" "}
                <span className="font-bold text-blue-800">
                  leitos ocupados desnecessariamente
                </span>{" "}
                e sobrecarga para o sistema de saúde.
              </p>
            </div>
          </div>
        </section>

        {/* 2. Solution Section: App, Differentiators & Tech - Solução (60s) */}
        <section id="solution" className="py-16">
          <SectionTitle>Alia: A Solução Que Acolhe e Conecta</SectionTitle>
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border-4 border-blue-400">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="relative w-full max-w-sm mx-auto bg-gray-100 rounded-3xl shadow-2xl overflow-hidden border-8 border-gray-800 aspect-[9/16]">
                {/* Simulated Phone Bezel */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-gray-800 rounded-b-xl z-10"></div>
                <div className="absolute top-6 left-2 w-2 h-2 bg-gray-700 rounded-full"></div>
                <div className="absolute top-6 right-2 w-2 h-2 bg-gray-700 rounded-full"></div>

                {/* App Screen */}
                <div className="w-full h-full p-2">
                  <AppMockup />
                </div>

                {/* Navigation Buttons for Mockup */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
                  <button
                    onClick={() => setCurrentAppScreen("home")}
                    className={`w-3 h-3 rounded-full ${
                      currentAppScreen === "home"
                        ? "bg-blue-600"
                        : "bg-gray-400"
                    } transition duration-300`}
                  ></button>
                  <button
                    onClick={() => setCurrentAppScreen("calls")}
                    className={`w-3 h-3 rounded-full ${
                      currentAppScreen === "calls"
                        ? "bg-blue-600"
                        : "bg-gray-400"
                    } transition duration-300`}
                  ></button>
                </div>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-blue-900 mb-6">
                  Diferenciais Que Nos Destacam
                </h3>
                <div className="space-y-6">
                  <IconCard
                    icon={ShieldCheck} // Usando componente Lucide
                    title="Segurança e Formalização"
                    description="Verificação de antecedentes e contratos claros para tranquilidade."
                    bgColor="bg-blue-100"
                    textColor="text-blue-800"
                  />
                  <IconCard
                    icon={Lightbulb} // Usando componente Lucide
                    title="Inteligência Artificial Alia AI"
                    description="Agendamento inteligente e suporte emocional para cuidadores."
                    bgColor="bg-blue-100"
                    textColor="text-blue-800"
                  />
                  {/* Imagem da Allya AI - Maior e "sobresaindo" */}
                  <div className="flex justify-center items-center py-4 relative z-10">
                    {" "}
                    {/* Adicionado z-10 */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-48 h-48 bg-blue-200 rounded-full opacity-70 blur-md z-0"></div>{" "}
                      {/* Adicionado z-0 para o círculo */}
                    </div>
                    <img
                      src="https://i.ibb.co/jv8NsmKW/image-removebg-preview.png" // URL da imagem da Allya AI fornecida pelo usuário
                      alt="Allya AI 3D"
                      className="w-64 h-auto object-contain transform scale-110 -translate-y-4 shadow-xl animate-pulse-fade z-20" // Ajustado para ser mais proeminente
                    />
                  </div>
                  <IconCard
                    icon={GraduationCap} // Usando componente Lucide
                    title="Módulo Alia Campus"
                    description="Conecta estudantes universitários a serviços leves, fomentando responsabilidade social."
                    bgColor="bg-blue-100"
                    textColor="text-blue-800"
                  />
                  <IconCard
                    icon={Heart} // Usando componente Lucide
                    title="Foco Exclusivo em Cuidados"
                    description="Especialização que nos diferencia de plataformas genéricas de serviços."
                    bgColor="bg-blue-100"
                    textColor="text-blue-800"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Market Opportunity Section: Data-Driven Growth - Oportunidade de Mercado (45s) */}
        <section id="market" className="py-16">
          <SectionTitle>
            O Mercado: Onde o Cuidado Encontra a Oportunidade
          </SectionTitle>
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border-4 border-blue-400">
            <h3 className="text-3xl font-bold text-blue-900 mb-8 text-center">
              Números Que Comprovam Nosso Potencial
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {marketOpportunityStats.map((stat, index) => (
                <StatCard
                  key={index}
                  value={stat.value}
                  label={stat.label}
                  icon={stat.icon} // Usando componente Lucide
                  color={stat.color}
                />
              ))}
            </div>
            <h3 className="text-3xl font-bold text-blue-900 mt-8 mb-6 text-center">
              Nosso Triplo Público-Alvo: A Base do Nosso Crescimento
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <IconCard
                icon={Target} // Usando componente Lucide
                title="Contratantes"
                description="Famílias buscando segurança e praticidade no cuidado."
                bgColor="bg-blue-100"
                textColor="text-blue-800"
              />
              <IconCard
                icon={Handshake} // Usando componente Lucide
                title="Prestadores"
                description="Profissionais em busca de formalização e visibilidade no mercado de cuidados."
                bgColor="bg-blue-100"
                textColor="text-blue-800"
              />
              <IconCard
                icon={Users} // Usando componente Lucide
                title="Alia Campus"
                description="Estudantes universitários que buscam flexibilidade e horas complementares."
                bgColor="bg-blue-100"
                textColor="text-blue-800"
              />
            </div>
            <p className="text-xl text-gray-700 text-center mt-8 leading-relaxed">
              <span className="font-bold text-blue-800">"Por que agora?"</span>{" "}
              O envelhecimento populacional e a crescente digitalização criam o
              momento perfeito para a Alia.
            </p>
          </div>
        </section>

        {/* 4. Business Model Section: Monetization & Financial Projections - Modelo de Negócio (30s) */}
        <section id="business-model" className="py-16">
          <SectionTitle>
            Viabilidade Financeira: Crescimento Acelerado
          </SectionTitle>
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border-4 border-blue-400">
            <h3 className="text-3xl font-bold text-blue-900 mb-8 text-center">
              Faturamento Escalável e Ponto de Equilíbrio Rápido
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              <div className="bg-gray-50 p-6 rounded-2xl shadow-inner border border-blue-200">
                <h4 className="text-xl font-semibold text-gray-700 mb-4">
                  Projeção de Receita e Custos (R$)
                </h4>
                <div className="h-64 min-w-0">
                  {" "}
                  {/* Adicionado min-w-0 */}
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={revenueProjectionData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                      <XAxis dataKey="name" stroke="#60a5fa" />
                      <YAxis stroke="#60a5fa" />
                      <Tooltip
                        formatter={(value) =>
                          `R$ ${value.toLocaleString("pt-BR")}`
                        }
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="Receita"
                        stroke="#10b981"
                        strokeWidth={3}
                        activeDot={{ r: 8 }}
                        name="Receita Total"
                      />{" "}
                      {/* Verde para receita */}
                      <Line
                        type="monotone"
                        dataKey="Custos"
                        stroke="#ef4444"
                        strokeWidth={3}
                        name="Custos Operacionais"
                      />{" "}
                      {/* Vermelho para custos */}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-sm text-gray-500 mt-2 text-center">
                  Faturamento de R$13.500 (Mês 1) para R$54.800 (Mês 7).
                </p>
                <p className="text-lg text-blue-700 font-semibold mt-4 text-center">
                  Ponto de Equilíbrio:{" "}
                  <span className="text-blue-800">4º - 5º Mês!</span>
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-2xl shadow-inner flex flex-col justify-center items-center border border-blue-200">
                <h4 className="text-xl font-semibold text-gray-700 mb-4">
                  Custos Iniciais MVP
                </h4>
                <p className="text-5xl font-bold text-blue-800 mt-2 mb-4">
                  R$ 50.5K - 56K
                </p>
                <p className="text-lg text-gray-700 text-center">
                  Investimento inicial otimizado para validação de mercado.
                </p>
                <button
                  onClick={() => setShowMVPDetailsModal(true)} // Botão para abrir o modal de detalhes do MVP
                  className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full shadow-md transition duration-300 transform hover:scale-105"
                >
                  Detalhes do Custo MVP
                </button>
                <button
                  onClick={() => setShowPricingSimulator(true)}
                  className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full shadow-md transition duration-300 transform hover:scale-105"
                >
                  Simular Precificação
                </button>
              </div>
            </div>

            {showPricingSimulator && (
              <Modal onClose={() => setShowPricingSimulator(false)}>
                <h3 className="text-3xl font-bold text-blue-800 mb-6">
                  Simulador de Precificação
                </h3>
                <div className="space-y-4 text-left">
                  <div>
                    <label
                      htmlFor="serviceType"
                      className="block text-gray-700 text-lg font-semibold mb-2"
                    >
                      Tipo de Serviço:
                    </label>
                    <select
                      id="serviceType"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                      value={serviceType}
                      onChange={(e) => setServiceType(e.target.value)}
                    >
                      <option value="cuidado-idoso">Cuidado de Idoso</option>
                      <option value="cuidado-crianca">
                        Cuidado de Criança
                      </option>
                      <option value="cuidado-pet">Cuidado de Pet</option>
                      <option value="afazeres-domesticos">
                        Afazeres Domésticos
                      </option>
                      <option value="acompanhamento">Acompanhamento</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="locationFactor"
                      className="block text-gray-700 text-lg font-semibold mb-2"
                    >
                      Localização:
                    </label>
                    <select
                      id="locationFactor"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                      value={locationFactor}
                      onChange={(e) =>
                        setLocationFactor(parseFloat(e.target.value))
                      }
                    >
                      <option value={0}>Normal (0%)</option>
                      <option value={0.05}>Alta Demanda (+5%)</option>
                      <option value={0.1}>Muito Alta Demanda (+10%)</option>
                    </select>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="urgency"
                      className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                      checked={urgency}
                      onChange={(e) => setUrgency(e.target.checked)}
                    />
                    <label
                      htmlFor="urgency"
                      className="ml-2 text-gray-700 text-lg"
                    >
                      Urgência (&lt; 6h) (+20%)
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="specialHours"
                      className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                      checked={specialHours}
                      onChange={(e) => setSpecialHours(e.target.checked)}
                    />
                    <label
                      htmlFor="specialHours"
                      className="ml-2 text-gray-700 text-lg"
                    >
                      Horários Especiais (+25%)
                    </label>
                  </div>
                  <div>
                    <label
                      htmlFor="professionalReputation"
                      className="block text-gray-700 text-lg font-semibold mb-2"
                    >
                      Reputação Profissional:
                    </label>
                    <input
                      type="range"
                      id="professionalReputation"
                      min="1.0"
                      max="5.0"
                      step="0.1"
                      value={professionalReputation}
                      onChange={(e) =>
                        setProfessionalReputation(parseFloat(e.target.value))
                      }
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg"
                    />
                    <span className="block text-center text-gray-600 mt-2">
                      Nota: {professionalReputation.toFixed(1)} (Acima de 4.8:
                      +10%)
                    </span>
                  </div>
                </div>
                <p className="text-3xl font-bold text-blue-800 mt-6">
                  Preço Estimado/Hora:{" "}
                  <span className="text-blue-600">R$ {calculatePrice()}</span>
                </p>
              </Modal>
            )}

            {showMVPDetailsModal && (
              <MVPDetailsModal onClose={() => setShowMVPDetailsModal(false)} />
            )}
          </div>
        </section>

        {/* 5. Validation Section: The Shocking Truth & Alia's Answer - VALIDAÇÃO REFORMULADA */}
        <section id="validation" className="py-16">
          <SectionTitle>
            A Verdade Cruel do Mercado: Por Que Alía É Essencial!
          </SectionTitle>
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border-4 border-blue-400">
            <h3 className="text-3xl font-bold text-blue-900 mb-8 text-center">
              A Realidade Chocante da Falta de Confiança
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12">
              {/* Lado Esquerdo: Gráfico de Barras */}
              <div className="bg-gray-50 p-6 rounded-2xl shadow-inner border border-blue-200">
                <h4 className="text-xl font-semibold text-gray-700 mb-4 text-center">
                  Onde as Pessoas Buscam Cuidado?
                </h4>
                <div className="h-64 min-w-0">
                  {" "}
                  {/* Adicionado min-w-0 */}
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={validationChartData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                      <XAxis dataKey="name" stroke="#4c51bf" />{" "}
                      {/* Roxo escuro */}
                      <YAxis stroke="#4c51bf" domain={[0, 100]} />
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Bar
                        dataKey="value"
                        fill="#4c51bf"
                        radius={[10, 10, 0, 0]}
                        label={{
                          position: "top",
                          formatter: (value) => `${value}%`,
                        }}
                      />{" "}
                      {/* Adicionado label */}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-sm text-gray-500 mt-2 text-center">
                  Dados da nossa pesquisa de mercado.
                </p>
              </div>

              {/* Lado Direito: Depoimentos Impactantes */}
              <div className="space-y-6">
                <div className="bg-red-50 p-6 rounded-2xl shadow-md border-l-4 border-red-500 animate-fade-in-delay">
                  <div className="flex items-center mb-3">
                    <AlertTriangle className="w-8 h-8 text-red-600 mr-3" />{" "}
                    {/* Ícone de alerta */}
                    <p className="text-xl font-semibold text-red-800">
                      Um Grito de Alerta!
                    </p>
                  </div>
                  <p className="text-lg text-gray-800 italic leading-relaxed">
                    "Nunca confiei nesses apps. Nunca sei quem vai aparecer na
                    minha porta."
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    - Trecho real de depoimento coletado.
                  </p>
                </div>
                <div className="bg-red-50 p-6 rounded-2xl shadow-md border-l-4 border-red-500 animate-fade-in-delay-2">
                  <div className="flex items-center mb-3">
                    <HeartCrack className="w-8 h-8 text-red-600 mr-3" />{" "}
                    {/* Ícone de coração partido */}
                    <p className="text-xl font-semibold text-red-800">
                      A Dor da Desistência!
                    </p>
                  </div>
                  <p className="text-lg text-gray-800 italic leading-relaxed">
                    "Meu pai ficou sem cuidador por 3 semanas porque eu tinha
                    medo de chamar alguém errado."
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    - Depoimento que revela a urgência.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-2xl md:text-3xl font-extrabold text-blue-900 text-center leading-relaxed mt-12 animate-pulse-fade-strong">
              O problema não é só a falta de oferta.
              <br />É a falta de confiança, de segurança, de alguém que
              realmente entenda o que é cuidar de alguém que se ama.
            </p>

            <h3 className="text-3xl font-bold text-blue-900 mb-6 text-center mt-12">
              É aqui que a Alía entra.
            </h3>
            <div className="bg-blue-100 p-8 rounded-2xl shadow-inner text-center border-2 border-blue-600 animate-fade-in-delay-3">
              <p className="text-xl md:text-2xl font-semibold text-blue-800 leading-relaxed">
                Com{" "}
                <span className="font-extrabold text-blue-900">
                  validação de identidade
                </span>
                ,{" "}
                <span className="font-extrabold text-blue-900">
                  reputação transparente
                </span>
                ,{" "}
                <span className="font-extrabold text-blue-900">
                  geolocalização
                </span>{" "}
                e uma interface feita para criar{" "}
                <span className="font-extrabold text-blue-900">
                  vínculos reais
                </span>
                , e não só contratos frios.
              </p>
            </div>

            <p className="text-xl text-gray-700 text-center leading-relaxed mt-8">
              <span className="font-bold text-blue-800">
                64% dos entrevistados
              </span>{" "}
              disseram já ter desistido de contratar por não sentir confiança na
              plataforma.
            </p>

            <h3 className="text-4xl md:text-5xl font-extrabold text-blue-900 text-center leading-tight mt-16 animate-pulse-fade-stronger">
              A Alía não é só um app.
              <br />É o início de uma nova forma de cuidar — com confiança,
              dignidade e presença.
            </h3>
          </div>
        </section>

        {/* 6. Competition & Differentiation Section - Concorrência e Diferenciação (30s) */}
        <section id="competition" className="py-16">
          <SectionTitle>
            Concorrência e Diferenciação: Por Que Alia?
          </SectionTitle>
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border-4 border-blue-400">
            <h3 className="text-3xl font-bold text-blue-900 mb-6 text-center">
              Alia vs. Concorrência: Nosso Potencial
            </h3>
            <div className="bg-gray-50 p-6 rounded-2xl shadow-inner border border-blue-200">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={competitionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="value"
                    onClick={(data) => setSelectedCompetitor(data.name)}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    } // Adicionado label com porcentagem
                  >
                    {competitionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value}`, name]} />{" "}
                  {/* Formatador para tooltip */}
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
              {selectedCompetitor && (
                <div className="mt-4 p-4 bg-white rounded-lg shadow-md border border-blue-200">
                  <h4 className="text-lg font-bold text-blue-800 mb-2">
                    Alia se destaca por:
                  </h4>
                  {selectedCompetitor === "Plataforma de Serviços Diversos" && (
                    <p className="text-gray-700 text-sm">
                      Nossa curadoria rigorosa e foco exclusivo em cuidados e
                      formalização nos diferenciam de plataformas genéricas.
                    </p>
                  )}
                  {selectedCompetitor === "App de Mão de Obra Geral" && (
                    <p className="text-gray-700 text-sm">
                      Oferecemos capacitação contínua e suporte emocional via
                      IA, algo que apps de mão de obra geral não priorizam.
                    </p>
                  )}
                  {selectedCompetitor === "Serviços de Cuidado Específicos" && (
                    <p className="text-gray-700 text-sm">
                      Combinamos tecnologia avançada (Alia AI) e um módulo de
                      responsabilidade social (Alia Campus), indo além dos
                      serviços específicos.
                    </p>
                  )}
                  {selectedCompetitor === "Plataforma Global de Cuidados" && (
                    <p className="text-gray-700 text-sm">
                      Nosso foco localizado e a segurança jurídica adaptada ao
                      Brasil nos dão uma vantagem sobre plataformas globais.
                    </p>
                  )}
                  {selectedCompetitor === "Alia (Potencial)" && (
                    <p className="text-gray-700 text-sm">
                      Nossa proposta de valor é única e diversificada,
                      impulsionando um potencial de mercado superior.
                    </p>
                  )}
                  <button
                    onClick={() => setSelectedCompetitor(null)}
                    className="mt-3 text-blue-600 hover:underline text-sm"
                  >
                    Fechar
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 7. NEW: Mission, Vision, Values, and Impacts Section */}
        <section id="mission-vision-values-impacts" className="py-16">
          <SectionTitle>
            Nossa Essência: Missão, Visão, Valores e Impactos
          </SectionTitle>
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border-4 border-blue-400">
            {/* Seção 1: Missão */}
            <div className="mb-12">
              <h3 className="text-3xl font-bold text-blue-900 mb-6 text-center">
                Nossa Missão
              </h3>
              <p className="text-xl md:text-2xl text-gray-700 text-center leading-relaxed bg-blue-50 p-6 rounded-xl shadow-inner border-l-4 border-blue-600">
                Promover conexões seguras, humanas e profissionais entre quem
                cuida e quem precisa ser cuidado — com dignidade, inclusão e
                presença.
              </p>
            </div>

            {/* Seção 2: Visão */}
            <div className="mb-12">
              <h3 className="text-3xl font-bold text-blue-900 mb-6 text-center">
                Nossa Visão
              </h3>
              <p className="text-xl md:text-2xl text-gray-700 text-center leading-relaxed bg-blue-50 p-6 rounded-xl shadow-inner border-l-4 border-blue-600">
                Ser a principal referência em{" "}
                <span className="font-extrabold text-blue-900">
                  qualidade, segurança e impacto social
                </span>{" "}
                no setor de cuidados pessoais e afetivos no Brasil até 2030.
              </p>
            </div>

            {/* Seção 3: Valores */}
            <div className="mb-12">
              <h3 className="text-3xl font-bold text-blue-900 mb-8 text-center">
                Nossos Valores
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <IconCard
                  icon={Heart}
                  title="Humanização das Relações"
                  description="Foco em criar laços genuínos, não apenas transações."
                  bgColor="bg-blue-100"
                  textColor="text-blue-800"
                />
                <IconCard
                  icon={Lock}
                  title="Segurança e Transparência"
                  description="Prioridade máxima na confiança e clareza em todas as interações."
                  bgColor="bg-blue-100"
                  textColor="text-blue-800"
                />
                <IconCard
                  icon={Activity} // Usando Activity do Lucide para representar gráfico/evolução
                  title="Capacitação e Desenvolvimento Contínuo"
                  description="Investimento na evolução profissional de nossos cuidadores."
                  bgColor="bg-blue-100"
                  textColor="text-blue-800"
                />
                <IconCard
                  icon={Globe}
                  title="Inclusão Social e Econômica"
                  description="Abrindo portas e gerando oportunidades para todos."
                  bgColor="bg-blue-100"
                  textColor="text-blue-800"
                />
                <IconCard
                  icon={Sparkles}
                  title="Cuidado com Propósito e Afeto"
                  description="Cada serviço é uma oportunidade de fazer a diferença com carinho."
                  bgColor="bg-blue-100"
                  textColor="text-blue-800"
                />
                <IconCard
                  icon={Rocket}
                  title="Compromisso com o Impacto Positivo"
                  description="Medir e amplificar nossa contribuição para a sociedade."
                  bgColor="bg-blue-100"
                  textColor="text-blue-800"
                />
              </div>
            </div>

            {/* Seção 4: Impactos */}
            <div>
              <h3 className="text-3xl font-bold text-blue-900 mb-8 text-center">
                Nossos Impactos
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                <div className="bg-blue-50 p-6 rounded-2xl shadow-inner border-l-4 border-blue-600">
                  <h4 className="text-2xl font-bold text-blue-800 mb-4">
                    No Trabalhador:
                  </h4>
                  <ul className="list-disc list-inside text-lg text-gray-700 space-y-2">
                    <li>
                      Geração de renda digna para estudantes e cuidadores
                      informais.
                    </li>
                    <li>Formação, capacitação e valorização profissional.</li>
                    <li>Autonomia e presença digital.</li>
                  </ul>
                </div>
                <div className="bg-blue-50 p-6 rounded-2xl shadow-inner border-l-4 border-blue-600">
                  <h4 className="text-2xl font-bold text-blue-800 mb-4">
                    Na Sociedade:
                  </h4>
                  <ul className="list-disc list-inside text-lg text-gray-700 space-y-2">
                    <li>Mais segurança na contratação.</li>
                    <li>Redução da sobrecarga no sistema público de saúde.</li>
                    <li>
                      Solução para famílias que precisam de cuidado imediato e
                      confiável.
                    </li>
                  </ul>
                </div>
              </div>
              <p className="text-2xl md:text-3xl font-extrabold text-blue-900 text-center leading-tight mt-12 animate-pulse-fade-stronger">
                “Cuidar é um ato de amor. E agora, também é um movimento social,
                econômico e transformador.”
              </p>
            </div>
            {/* Botão para navegar para a tela final do pitch */}
            <div className="flex justify-center mt-12">
              <button
                onClick={() => navigateTo("final-pitch")}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-12 rounded-full shadow-lg transition duration-300 transform hover:scale-105 text-xl animate-bounce-slow"
              >
                Ir para o Final do Pitch! 🚀
              </button>
            </div>
          </div>
        </section>

        {/* 8. Final Pitch Section - FRASE FINAL DO PITCH (versão oficial) */}
        <section
          id="final-pitch"
          className="min-h-screen flex flex-col items-center justify-center text-center py-16 bg-gradient-to-br from-blue-200 to-purple-200 relative overflow-hidden"
        >
          {" "}
          {/* Adicionado gradiente animado e overflow-hidden */}
          {/* Elementos de fundo animados */}
          <div className="absolute inset-0 z-0">
            <div
              className="absolute w-48 h-48 bg-blue-300 rounded-full opacity-30 animate-spin-slow"
              style={{ top: "10%", left: "15%" }}
            ></div>
            <div
              className="absolute w-32 h-32 bg-purple-300 rounded-lg opacity-30 animate-spin-reverse-slow"
              style={{
                bottom: "20%",
                right: "10%",
                transform: "rotate(45deg)",
              }}
            ></div>
            <div
              className="absolute w-64 h-64 bg-blue-400 rounded-full opacity-20 animate-spin-medium"
              style={{ top: "60%", left: "5%", transform: "scale(0.8)" }}
            ></div>
            <div
              className="absolute w-40 h-40 bg-purple-400 rounded-xl opacity-25 animate-spin-fast"
              style={{ bottom: "5%", left: "40%", transform: "rotate(-30deg)" }}
            ></div>
          </div>
          <div className="bg-white p-8 md:p-16 rounded-3xl shadow-2xl max-w-4xl w-full relative z-10 animate-fade-in border-4 border-blue-400">
            <h3 className="text-5xl md:text-6xl font-extrabold text-blue-900 mb-8 text-center relative pb-4 animate-slide-up-slow">
              Palavras não bastam.
            </h3>
            <p className="text-4xl md:text-5xl font-bold text-blue-700 mb-6 animate-fade-in-delay-2">
              Cuidar é ação.
            </p>
            <p className="text-6xl md:text-7xl font-extrabold text-blue-900 mb-10 animate-pulse-fade-stronger">
              <AnimatedTextDisplay
                phrases={[
                  "Seja um Alia(do).",
                  "Alie-se.",
                  "Venha se Alia(r).",
                  "Cuidar vai além da ação, cuidar é se Aliar - Obrigado!",
                ]}
                typingSpeed={100}
                deletingSpeed={50}
                pauseTime={1500}
              />
            </p>

            <div className="flex flex-col items-center justify-center space-y-6 mb-10">
              {/* QR Code para contato */}
              <img
                src="https://placehold.co/200x200/2563eb/ffffff?text=QR+Code" // Substitua por sua URL do QR Code real
                alt="QR Code para contato"
                className="w-48 h-48 rounded-lg shadow-xl border-4 border-blue-400 animate-scale-up"
              />
              <p className="text-xl md:text-2xl text-gray-700 leading-relaxed max-w-2xl mx-auto">
                Escaneie o QR Code e seja parte da mudança que a gente sonha ver
                nas ruas, nos hospitais, nas casas e nas rotinas.
              </p>
            </div>

            <div className="flex flex-col items-center space-y-4">
              {/* A logo da Alia surge animada com a frase "Seja um Alia(do)" brilhando */}
              <img
                src="https://i.ibb.co/3mRbJJhP/Alia-3x-2.png" // URL da logo da Alia
                alt="Logo da Alia"
                className="w-48 h-auto object-contain mb-4 animate-pulse-fade-stronger" // Aumentado o tamanho da logo final
              />
              {/* A frase "Seja um Alia(do). Seja uma Alia." agora faz parte da animação de texto acima */}
              <button
                onClick={() =>
                  alert("Pitch Finalizado! Agradecemos sua atenção.")
                } // Use um modal personalizado se preferir
                className="mt-8 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold py-4 px-12 rounded-full shadow-2xl transition duration-500 transform hover:scale-110 animate-bounce-slow text-2xl border-b-4 border-blue-900"
              >
                Finalizar Pitch
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-8 text-center rounded-t-xl">
        <p>
          &copy; {new Date().getFullYear()} Alia. Todos os direitos reservados.
        </p>
        <p className="text-sm mt-2">Cuidar é se alia(r).</p>
      </footer>
    </div>
  );
};

export default App;
