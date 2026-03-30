// Funcion para obtener la primera pregunta sin respuesta de una lista de preguntas

export function getPendingQuestion(questions = []) {
  return questions.find((q) => !(q.answers && q.answers.length > 0)) || null;
}

export function getVehicleTitle(vehicle) {
  if (!vehicle) {
    return "Vehicle";
  }

  let title = "";

  if (vehicle.brand) {
    title = vehicle.brand;
  }

  if (vehicle.model) {
    title = title ? `${title} ${vehicle.model}` : vehicle.model;
  }

  if (vehicle.year) {
    title = title ? `${title} ${vehicle.year}` : String(vehicle.year);
  }

  return title || "Vehicle";
}

export function getBuyerLabel(user) {
  if (!user) {
    return "Buyer";
  }

  if (user.username) {
    return user.username;
  }

  if (user.name) {
    return user.name;
  }

  return "Buyer";
}

export function buildInboxThreads(questions = []) {
  const threadsMap = new Map();

  for (const question of questions) {
    const vehicle = question.vehicle;
    const vehicleId = vehicle && vehicle._id ? vehicle._id : "unknown-vehicle";
    const buyer = question.user;
    const buyerId = buyer && buyer._id ? buyer._id : "unknown-buyer";
    const threadId = `${vehicleId}-${buyerId}`;

    if (!threadsMap.has(threadId)) {
      threadsMap.set(threadId, {
        threadId,
        vehicle,
        buyer,
        questions: [],
      });
    }

    threadsMap.get(threadId).questions.push(question);
  }

  return Array.from(threadsMap.values());
}

export function buildQuestionThreads(questions = []) {
  const threadsMap = new Map();

  for (const question of questions) {
    const vehicle = question.vehicle;
    const vehicleId = vehicle && vehicle._id ? vehicle._id : "unknown-vehicle";

    if (!threadsMap.has(vehicleId)) {
      threadsMap.set(vehicleId, {
        threadId: vehicleId,
        vehicle,
        questions: [],
      });
    }

    threadsMap.get(vehicleId).questions.push(question);
  }

  return Array.from(threadsMap.values());
}

export function buildBuyerThreads(questions = []) {
  const threadsMap = new Map();

  for (const question of questions) {
    const buyer = question.user;
    const buyerId = buyer && buyer._id ? buyer._id : "unknown-buyer";

    if (!threadsMap.has(buyerId)) {
      threadsMap.set(buyerId, {
        threadId: buyerId,
        buyer,
        questions: [],
      });
    }

    threadsMap.get(buyerId).questions.push(question);
  }

  return Array.from(threadsMap.values());
}

export function getSelectedThread(threads = [], selectedThreadId) {
  return threads.find((thread) => thread.threadId === selectedThreadId) || threads[0] || null;
}

export function appendQuestion(previousQuestions, question) {
  return previousQuestions.concat(question);
}

export function appendAnswerToQuestion(previousQuestions, questionId, answer) {
  return previousQuestions.map((question) => {
    if (question._id !== questionId) {
      return question;
    }

    const currentAnswers = question.answers || [];
    const updatedAnswers = currentAnswers.concat(answer);

    return {
      _id: question._id,
      text: question.text,
      date: question.date,
      user: question.user,
      vehicle: question.vehicle,
      answers: updatedAnswers,
    };
  });
}