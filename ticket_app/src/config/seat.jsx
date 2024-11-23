export const generateSeats = () => {
    let numRows = 6;
    let rowArrays = [];
    let start = 1;

    for (let i = 0; i < numRows; i++) {
        let colsArray = [];

        if (i === 0) {
            colsArray.push({
                number: start,
                taken: Boolean(Math.round(Math.random())),
                selected: false,
            });
            start++;

            colsArray.push(null);

            colsArray.push({
                number: start,
                taken: Boolean(Math.round(Math.random())),
                selected: false,
            });
            start++;
        } else {
            for (let j = 0; j < 3; j++) {
                let seatObject = {
                    number: start,
                    taken: Boolean(Math.round(Math.random())),
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