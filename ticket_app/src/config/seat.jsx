export const generateSeats = () => {
    let numRows = 6;
    let rowArrays = [];
    let start = 1;

    for (let i = 0; i < numRows; i++) {
        let colsArray = [];

        if (i === 0) {
            colsArray.push({
                number: start,
                taken: false,
                selected: false,
            });
            start++;

            colsArray.push(null);

            colsArray.push({
                number: start,
                taken: false,
                selected: false,
            });
            start++;
        } else {
            for (let j = 0; j < 3; j++) {
                let seatObject = {
                    number: start,
                    taken: false,
                    selected: false,
                };
                colsArray.push(seatObject);
                start++;
            }
        }

        rowArrays.push(colsArray);
    }

    const duplicatedRows = rowArrays.map(row =>
        row.map(seat =>
            seat ? { ...seat, number: seat.number + start - 1 } : null
        )
    );

    rowArrays = rowArrays.concat(duplicatedRows);
    return rowArrays;
};

export const generate41Seats = () => {

    let seatNumber = 1;
    let rowArrays = [];

    // Hàng 1 đến 6: Mỗi hàng 3 ghế
    for (let i = 0; i < 6; i++) {
        let colsArray = [];
        for (let j = 0; j < 3; j++) {
            colsArray.push({
                number: seatNumber,
                taken: false,
                selected: false,
            });
            seatNumber++;
        }
        rowArrays.push(colsArray);
    }

    // Hàng 7: Có 5 ghế
    let lastRow = [];
    for (let j = 0; j < 5; j++) {
        lastRow.push({
            number: seatNumber,
            taken: false,
            selected: false,
        });
        seatNumber++;
    }
    rowArrays.push(lastRow);

    // Hàng 8 đến 13: Mỗi hàng 3 ghế
    for (let i = 0; i < 6; i++) {
        let colsArray = [];
        for (let j = 0; j < 3; j++) {
            colsArray.push({
                number: seatNumber,
                taken: false,
                selected: false,
            });
            seatNumber++;
        }
        rowArrays.push(colsArray);
    }

    return rowArrays;
};
