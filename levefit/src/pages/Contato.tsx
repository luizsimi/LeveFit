import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaWhatsapp,
  FaArrowLeft,
  FaLeaf,
  FaInstagram,
  FaFacebook,
  FaTwitter,
  FaPaperPlane,
  FaExclamationCircle,
  FaCheckCircle,
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Contato = () => {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    assunto: "",
    mensagem: "",
  });
  const [enviando, setEnviando] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState("");
  const [erro, setErro] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setErro("");

    // Simulação de envio (em produção usaríamos uma API real)
    setTimeout(() => {
      setEnviando(false);
      setMensagemSucesso(
        "Sua mensagem foi enviada com sucesso! Entraremos em contato em breve."
      );
      setFormData({
        nome: "",
        email: "",
        assunto: "",
        mensagem: "",
      });

      // Limpar mensagem de sucesso após 5 segundos
      setTimeout(() => {
        setMensagemSucesso("");
      }, 5000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
              Entre em Contato
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-2xl">
              Estamos ansiosos para ouvir você! Dúvidas, sugestões ou feedback -
              responderemos rapidamente.
            </p>
          </div>

          <Link
            to="/"
            className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 text-white rounded-lg hover:shadow-lg transition duration-300 transform hover:-translate-y-0.5 self-start md:self-auto"
          >
            <FaArrowLeft className="mr-2" /> Voltar para início
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Informações de Contato - 2 colunas em desktop */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 p-5 text-white flex items-center justify-between">
                <h2 className="text-xl font-bold">Informações de Contato</h2>
                <FaLeaf className="text-2xl opacity-80" />
              </div>

              <div className="p-6 space-y-6">
                <div className="flex items-start transition-all duration-300 hover:translate-x-1">
                  <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-3 rounded-lg mr-4 shadow-sm">
                    <FaMapMarkerAlt className="text-xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 dark:text-white mb-1">
                      Endereço
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Jardim Jose Ometto II
                      <br />
                      Araras - São Paulo, 13606-360
                    </p>
                  </div>
                </div>

                <div className="flex items-start transition-all duration-300 hover:translate-x-1">
                  <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-3 rounded-lg mr-4 shadow-sm">
                    <FaPhoneAlt className="text-xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 dark:text-white mb-1">
                      Telefone
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      (19) 3456-7890
                    </p>
                  </div>
                </div>

                <div className="flex items-start transition-all duration-300 hover:translate-x-1">
                  <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-3 rounded-lg mr-4 shadow-sm">
                    <FaEnvelope className="text-xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 dark:text-white mb-1">
                      Email
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      contato@levefit.com.br
                    </p>
                  </div>
                </div>

                <div className="flex items-start transition-all duration-300 hover:translate-x-1">
                  <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-3 rounded-lg mr-4 shadow-sm">
                    <FaWhatsapp className="text-xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 dark:text-white mb-1">
                      WhatsApp
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      (19) 98765-4321
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-gray-700 to-gray-800 dark:from-gray-800 dark:to-gray-900 p-5 text-white">
                <h2 className="text-xl font-bold">Horário de Atendimento</h2>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300">
                    Segunda a Sexta
                  </span>
                  <span className="font-semibold text-gray-800 dark:text-white">
                    9h às 18h
                  </span>
                </div>
                <div className="border-t border-gray-100 dark:border-gray-700 pt-3 flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300">
                    Sábado
                  </span>
                  <span className="font-semibold text-gray-800 dark:text-white">
                    9h às 13h
                  </span>
                </div>
                <div className="border-t border-gray-100 dark:border-gray-700 pt-3 flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300">
                    Domingo e Feriados
                  </span>
                  <span className="font-semibold text-gray-800 dark:text-white">
                    Fechado
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="font-bold text-gray-800 dark:text-white mb-4">
                  Nossas Redes Sociais
                </h3>
                <div className="flex space-x-3">
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gradient-to-br from-purple-500 to-pink-500 text-white p-3 rounded-lg hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    aria-label="Instagram"
                  >
                    <FaInstagram className="text-xl" />
                  </a>
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-3 rounded-lg hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    aria-label="Facebook"
                  >
                    <FaFacebook className="text-xl" />
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gradient-to-br from-blue-400 to-blue-500 text-white p-3 rounded-lg hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    aria-label="Twitter"
                  >
                    <FaTwitter className="text-xl" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Formulário de Contato - 3 colunas em desktop */}
          <div className="md:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden animate-fadeIn">
              <div className="bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 p-5 text-white">
                <h2 className="text-xl font-bold">Envie uma Mensagem</h2>
                <p className="text-green-100 dark:text-green-200 text-sm mt-1">
                  Preencha o formulário abaixo e entraremos em contato o mais
                  breve possível.
                </p>
              </div>

              <div className="p-6">
                {mensagemSucesso && (
                  <div className="bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-400 px-4 py-3 rounded-lg mb-6 flex items-start">
                    <FaCheckCircle className="text-green-500 dark:text-green-400 mt-1 mr-2 flex-shrink-0" />
                    <span>{mensagemSucesso}</span>
                  </div>
                )}

                {erro && (
                  <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6 flex items-start">
                    <FaExclamationCircle className="text-red-500 dark:text-red-400 mt-1 mr-2 flex-shrink-0" />
                    <span>{erro}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                        Nome Completo*
                      </label>
                      <input
                        type="text"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Seu nome"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                        Email*
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                        placeholder="seu.email@exemplo.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                      Assunto*
                    </label>
                    <select
                      name="assunto"
                      value={formData.assunto}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white appearance-none bg-white dark:bg-gray-700"
                    >
                      <option value="">Selecione um assunto</option>
                      <option value="Dúvida">Dúvida</option>
                      <option value="Sugestão">Sugestão</option>
                      <option value="Reclamação">Reclamação</option>
                      <option value="Parceria">Parceria</option>
                      <option value="Outro">Outro</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                      Mensagem*
                    </label>
                    <textarea
                      name="mensagem"
                      value={formData.mensagem}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white resize-none"
                      placeholder="Digite sua mensagem aqui..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={enviando}
                    className={`w-full py-3 bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 text-white rounded-lg hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center font-medium ${
                      enviando ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {enviando ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Enviando mensagem...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <FaPaperPlane className="mr-2" />
                        Enviar mensagem
                      </span>
                    )}
                  </button>

                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    * Campos obrigatórios. Sua privacidade é importante para
                    nós, seus dados não serão compartilhados.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contato;
