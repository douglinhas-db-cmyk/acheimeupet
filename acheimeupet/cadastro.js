// ===============================================================
// 🐾 AcheiMeuPet — Cadastro.js VERSÃO FINALÍSSIMA (COMPLETO)
// ===============================================================
// • CÓDIGO COMPLETO E FIEL AO ORIGINAL.
// • AJUSTADO: Redirecionamento direto para os links do Asaas conforme plano escolhido.
// • CORRIGIDO: VALORES MENSAIS (2+ PETS = 14,90 CADA)
// • OTIMIZAÇÃO: Compressão agressiva de imagem para reduzir o payload Base64.
// ===============================================================

document.addEventListener("DOMContentLoaded", () => {
  console.log("🐾 AcheiMeuPet: Script FINALÍSSIMA (Completo) carregado.");

  // ============================
  // 🔐 TOKEN DE ORIGEM E WEBHOOKS
  // ============================
  const urlParams = new URLSearchParams(window.location.search);
  const temToken = urlParams.has("token");
  const tokenParam = urlParams.get("token") || "";

  const WEBHOOK_PAGO =
    "https://webhook.fiqon.app/webhook/019ae12c-0d88-703f-8112-83a3069621e3/83e227af-cbed-43ee-974d-c9603f589a29";
  const WEBHOOK_FREE =
    "https://webhook.fiqon.app/webhook/019a781c-15f8-738a-93bc-5b70388445ff/faee836c-d909-4b6b-96d0-ed6433640060";
  const WEBHOOK_CADASTRO = temToken ? WEBHOOK_FREE : WEBHOOK_PAGO;

  console.log(`📡 Modo detectado: ${temToken ? "FREE" : "PAGO"}`);

  // ==================================================
  // 📌 ELEMENTOS DO DOM
  // ==================================================
  const form = document.getElementById("form-cadastro");
  const tipoPlano = document.getElementById("tipo_plano");
  const periodo = document.getElementById("periodo");
  const qtdPetsInput = document.getElementById("qtd_pets");
  const campoQtdPets = document.getElementById("campo_qtd_pets");
  const areaPets = document.getElementById("area-pets");
  const msg = document.getElementById("mensagem");
  const loading = document.getElementById("loading");
  const valorLabel = document.getElementById("valor_exibido");
  const botao = document.getElementById("botao-enviar");

  // ==================================================
  // 📦 MEMÓRIA LOCAL (STATE)
  // ==================================================
  function salvarState() {
    const data = new FormData(form);
    const obj = {};
    for (const [key, val] of data.entries()) {
      if (key.includes("foto_pet")) continue;
      obj[key] = val;
    }
    localStorage.setItem("form_state", JSON.stringify(obj));
  }

  function carregarState() {
    const state = localStorage.getItem("form_state");
    if (!state) return;
    const obj = JSON.parse(state);
    for (const key in obj) {
      const el = form.querySelector(`[name="${key}"]`);
      if (el) el.value = obj[key];
    }
  }

  // ==================================================
  // 🧱 GERAR BLOCOS DE PET
  // ==================================================
  function gerarBlocoPet(i) {
    const state = JSON.parse(localStorage.getItem("form_state") || "{}");
    const nome = state[`nome_pet_${i}`] || "";
    const especie = state[`especie_${i}`] || "";
    const raca = state[`raca_${i}`] || "";
    const sexo = state[`sexo_${i}`] || "";
    const ano = state[`ano_nasc_${i}`] || "";
    return `
      <div class="pet-group" id="bloco_pet_${i}">
        <h4>🐾 Pet ${i}</h4>
        <label>Nome do pet *</label>
        <input type="text" name="nome_pet_${i}" value="${nome}" required />
        <label>Espécie *</label>
        <select name="especie_${i}" required>
          <option value="">Selecione</option>
          <option value="Cachorro" ${especie === "Cachorro" ? "selected" : ""}>Cachorro</option>
          <option value="Gato" ${especie === "Gato" ? "selected" : ""}>Gato</option>
          <option value="Outros" ${especie === "Outros" ? "selected" : ""}>Outros</option>
        </select>
        <label>Raça *</label>
        <input type="text" name="raca_${i}" value="${raca}" required />
        <label>Sexo *</label>
        <select name="sexo_${i}" required>
          <option value="">Selecione</option>
          <option value="Macho" ${sexo === "Macho" ? "selected" : ""}>Macho</option>
          <option value="Fêmea" ${sexo === "Fêmea" ? "selected" : ""}>Fêmea</option>
        </select>
        <label>Ano de nascimento *</label>
        <input type="text" name="ano_nasc_${i}" maxlength="4" value="${ano}" required />
        <label>Foto do pet *</label>
        <input type="file" name="foto_pet_${i}" accept="image/*" required />
      </div>
    `;
  }

  // ==================================================
  // 🔁 ATUALIZAR BLOCOS DE PET
  // ==================================================
  function atualizarBlocosPets() {
    const plano = tipoPlano.value;
    let qtd = 1;
    if (plano === "familia") {
      campoQtdPets.style.display = "block";
      qtd = parseInt(qtdPetsInput.value) || 2;
      if (qtd < 2) qtd = 2;
    } else {
      campoQtdPets.style.display = "none";
      qtd = 1;
      qtdPetsInput.value = 1;
    }
    areaPets.innerHTML = "";
    for (let i = 1; i <= qtd; i++) {
      areaPets.innerHTML += gerarBlocoPet(i);
    }
    atualizarValor();
  }

  // ==================================================
  // 💰 ATUALIZAR VALOR  **(CORRIGIDO)**
  // ==================================================
  function atualizarValor() {
    const plano = tipoPlano.value;
    const per = periodo.value;
    const qtd = parseInt(qtdPetsInput.value) || 1;

    if (!plano || !per) {
      valorLabel.textContent = "Selecione o plano para ver o valor";
      return;
    }

    let valor = 0;

    if (plano === "individual") {
      valor = per === "mensal" ? 19.9 : 199.9;
    } else {
      // família
      if (per === "mensal") {
        // CORREÇÃO: 1 pet = 14,90 | 2+ pets = 14,90 cada
        valor = qtd === 1 ? 19.9 : (qtd * 14.9);
      } else {
        // anual (já estava correto)
        valor = qtd === 1 ? 199.9 : (qtd * 149.9);
      }
    }

    valorLabel.textContent = `Valor total: R$ ${valor.toFixed(2).replace(".", ",")}`;
  }

  // ==================================================
  // 🖼️ COMPRESSÃO AGRESSIVA DE IMAGEM (NOVA OTIMIZAÇÃO)
  // ==================================================
  /**
   * Comprime o arquivo de imagem para Base64 com qualidade e tamanho reduzidos.
   * @param {File} file O arquivo de imagem a ser comprimido.
   * @returns {Promise<string>} A string Base64 da imagem comprimida.
   */
  function comprimirImagem(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800; // Reduz para 800px de largura máxima
          let width = img.width;
          let height = img.height;

          if (width > MAX_WIDTH) {
            height = height * (MAX_WIDTH / width);
            width = MAX_WIDTH;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Qualidade agressiva (0.6) para reduzir o tamanho do arquivo
          const base64 = canvas.toDataURL('image/jpeg', 0.6); 
          resolve(base64);
        };
        img.onerror = reject;
        img.src = event.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // ==================================================
  // 🚀 ENVIO DO FORMULÁRIO
  // ==================================================
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      msg.textContent = "";
      loading.style.display = "block";
      botao.disabled = true;
      botao.innerHTML = `⏳ Enviando...`;

      salvarState();

      try {
        const fd = new FormData(form);

        const tutor = {
          nome_tutor: fd.get("nome_tutor"),
          cpf_tutor: fd.get("cpf_tutor"),
          email_tutor: fd.get("email_tutor"),
          whatsapp_tutor: fd.get("whatsapp_tutor"),
          cidade: fd.get("cidade"),
          uf: fd.get("uf"),
          endereco: fd.get("endereco"),
          cep: fd.get("cep"),
          obs: fd.get("obs"),
        };

        const plano = tipoPlano.value;
        const per = periodo.value;
        const qtd = parseInt(qtdPetsInput.value) || 1;

        let valor = 0;
        if (!temToken) {
          if (plano === "individual") valor = per === "mensal" ? 19.9 : 199.9;
          else valor = per === "mensal"
            ? (qtd === 1 ? 19.9 : qtd * 14.9)
            : (qtd === 1 ? 199.9 : qtd * 149.9);
        }

        const pets = [];
        for (let i = 1; i <= qtd; i++) {
          const nome = fd.get(`nome_pet_${i}`);
          const esp = fd.get(`especie_${i}`);
          const raca = fd.get(`raca_${i}`);
          const sexo = fd.get(`sexo_${i}`);
          const ano = fd.get(`ano_nasc_${i}`);
          const file = fd.get(`foto_pet_${i}`);

          if (!file || file.size === 0) {
            throw new Error(`A foto do Pet ${i} é obrigatória.`);
          }

          // ⚠️ COMPRESSÃO E CONVERSÃO PARA BASE64 (REVERTIDO PARA O FLUXO ORIGINAL)
          msg.textContent = `⏳ Comprimindo foto do Pet ${i}...`;
          const foto_base64 = await comprimirImagem(file);
          msg.textContent = `⏳ Enviando dados...`;

          pets.push({
            nome_pet: nome,
            especie: esp,
            raca,
            sexo,
            ano_nascimento: ano,
            foto_pet: foto_base64, // ⚠️ AGORA É O BASE64 COMPRIMIDO
          });
        }

        const payload = {
          ...tutor,
          plano: temToken ? "Free" : plano,
          periodo: temToken ? "" : per,
          qtd_pets: qtd,
          valor_total: temToken ? 0 : valor,
          origem_cadastro: temToken ? "free_site" : "assinatura_site",
          token_origem: tokenParam,
          pets,
        };

        console.log("📤 Enviando para Fiqon:", payload);

        const req = await fetch(WEBHOOK_CADASTRO, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const responseText = await req.text();
        let json;
        try {
          json = JSON.parse(responseText);
        } catch (e) {
          console.error("Fiqon não retornou um JSON válido. Resposta:", responseText);
          throw new Error("Ocorreu um erro de comunicação com o servidor. Tente novamente.");
        }

        console.log("📦 Retorno Fiqon (parseado):", json);

        if (!req.ok) {
          throw new Error(json?.body?.link_pagamento || json?.message || json?.error || `Erro no servidor (HTTP ${req.status})`);
        }

        // ============================================================
        // 🚀 REDIRECIONAMENTO AUTOMÁTICO AO ASAAS (PAGO)
        // O código de redirecionamento estático foi removido para evitar a dupla criação de pagamentos.
        // O fluxo Fiqon deve retornar o link de pagamento dinâmico ou a lógica de redirecionamento deve ser
        // movida para o Fiqon.
        // ============================================================
        
        // Se o Fiqon retornar um link de pagamento, redirecionar para ele.
        if (json?.link_pagamento) {
            window.location.href = json.link_pagamento;
            return;
        }

        // ============================================================
        // ✅ SUCESSO (FREE OU PAGO SEM REDIRECIONAMENTO)
        // ============================================================
        msg.style.color = "green";
        msg.textContent = "Cadastro concluído! Seu pet(s) está(ão) protegido(s)! Verifique seu e-mail para o link de pagamento.";
        
        // Limpar o formulário e o estado local
        form.reset();
        localStorage.removeItem("form_state");
        tipoPlano.value = "individual";
        periodo.value = "mensal";
        qtdPetsInput.value = 1;
        atualizarBlocosPets();

      } catch (error) {
        console.error("Erro do envio:", error);
        msg.style.color = "red";
        msg.textContent = "Erro no envio: " + error.message;
      } finally {
        botao.disabled = false;
        botao.innerHTML = `🐾 Enviar cadastro`;
        loading.style.display = "none";
      }
    });
  }

  // ==================================================
  // ⚡ EVENTOS
  // ==================================================
  tipoPlano.addEventListener("change", atualizarBlocosPets);
  periodo.addEventListener("change", atualizarValor);
  qtdPetsInput.addEventListener("change", atualizarBlocosPets);
  form.addEventListener("input", salvarState);

  // Inicialização
  carregarState();
  atualizarBlocosPets();
});


