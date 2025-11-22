function assignProcessToMachine(selectedMachine, processId) {
    // Sprawdź czy proces istnieje w dostępnych procesach
    const processTemplate = processes.find(p => p.id == processId);
    if (!processTemplate) {
        console.error('Szablon procesu nie istnieje:', processId);
        return null;
    }

    // Sprawdź czy proces nie jest już przypisany do tej maszyny
    const alreadyAssigned = currentProcesses.find(cp =>
        cp.assignedMachine === selectedMachine.id && cp.processId == processId && cp.status !== 'completed'
    );

    if (alreadyAssigned) {
        console.error('Proces już przypisany do tej maszyny');
        return null;
    }

    // Utwórz nowe przypisanie procesu
    const newProcessAssignment = {
        id: currentProcesses.length > 0 ? Math.max(...currentProcesses.map(p => p.id)) + 1 : 1,
        processId: parseInt(processId),
        assignedMachine: selectedMachine.id,
        assignedAt: new Date().toISOString(),
        status: 'pending'
    };

    currentProcesses.push(newProcessAssignment);

    console.log('Proces przypisany:', newProcessAssignment);
    return newProcessAssignment;
}

function removeProcessAssignment(assignmentId) {
    const index = currentProcesses.findIndex(cp => cp.id == assignmentId);

    if (index === -1) {
        console.error('Przypisanie nie istnieje:', assignmentId);
        return false;
    }

    currentProcesses.splice(index, 1);
    console.log('Przypisanie usunięte:', assignmentId);

    // Odśwież widok procesów
    if (typeof renderProcesses === 'function') {
        renderProcesses();
    }

    return true;
}
